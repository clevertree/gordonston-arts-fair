'use server'

import {getRedisClient} from "@util/redis";
import bcrypt from "bcrypt";
import {endSession, startSession, validateSession} from "@util/session";
import {sendMail} from "@util/email";
import {randomBytes} from "node:crypto";
import {HttpError} from "@util/exception/httpError";

export type ActionResponse = {
    status: 'success' | 'error';
    message: string;
    redirectURL?: string;
}

export async function loginAction(email: string, password: string): Promise<ActionResponse> {
    const redisClient = await getRedisClient();
    const redisLoginKey = 'user:' + email.toLowerCase() + ":login";

    const count = await redisClient.exists(redisLoginKey);
    const errorMessage = "Invalid email/password combination. Please try again or register before logging in";
    if (count === 0) {
        // Add an error log entry
        await addLogEntry(email, 'log-in-error', "Invalid email")
        return {
            message: errorMessage,
            status: 'error'
        }
    }

    // Fetch user from the database
    const passwordHash = await redisClient.get(redisLoginKey);
    const passwordResult = passwordHash && await bcrypt.compare(password, passwordHash);
    if (!passwordResult) {
        // Add an error log entry
        await addLogEntry(email, 'log-in-error', "Invalid password")
        return {
            message: errorMessage,
            status: 'error'
        }
    }

    await startSession(email)
    const isAdmin = !!(await redisClient.get(`user:${email.toLowerCase()}:admin`));

    // Add a log entry
    await addLogEntry(email, 'log-in', "")


    return {
        status: 'success',
        message: "Login successful. Redirecting...",
        redirectURL: isAdmin ? "/user" : "/profile"
    }
}

export async function logoutAction(): Promise<ActionResponse> {
    const oldSession = await endSession();

    // Add a log entry
    await addLogEntry(oldSession.email, 'log-out', "")

    return {
        status: 'success',
        message: "Log out successful. Redirecting...",
        redirectURL: "/login"
    }
}

export async function registerAction(email: string, password: string): Promise<ActionResponse> {
    const redisClient = await getRedisClient();
    const redisLoginKey = 'user:' + email.toLowerCase() + ":login";

    const count = await redisClient.exists(redisLoginKey);
    if (count >= 1) {
        // Add an error log entry
        await addLogEntry(email, 'register-error', "User already exists")
        console.error('User already exists:', email);
        return {
            message: "User already exists with this email. Please log in or reset your password",
            status: 'error'
        }
    }

    // Store user in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    await redisClient.set(redisLoginKey, hashedPassword);

    const redisCreatedKey = 'user:' + email.toLowerCase() + ":createdAt";
    await redisClient.set(redisCreatedKey, new Date().toISOString());

    console.log("Registered a new user: ", email)

    // Create the user session
    await startSession(email);

    // Add a log entry
    await addLogEntry(email, 'registered', "")

    // Send the registration email
    await sendMail({
        to: email,
        html: "HTML",
        text: "TEXT",
        subject: "Registration Complete"
    })

    return {
        status: 'success',
        message: "Registration complete. Please check your email for a confirmation link",
        redirectURL: "/profile"
    }
}

export async function passwordResetAction(email: string): Promise<ActionResponse> {
    const redisClient = await getRedisClient();
    const redisLoginKey = 'user:' + email.toLowerCase() + ":login";

    const count = await redisClient.exists(redisLoginKey);
    if (count === 0) {
        // Add a log entry
        await addLogEntry(email, 'log-in-error', "User not found for password reset")
        return {
            message: "User not found for password reset: " + email,
            status: 'error',
        }
    }

    // Store password reset request
    const resetCode = Buffer.from(randomBytes(36)).toString('hex');
    const redisPasswordResetKey = 'user:' + email.toLowerCase() + ":reset-password";
    await redisClient.set(redisPasswordResetKey, resetCode, {EX: 60 * 15})

    console.log("Password reset request: ", email, resetCode)

    // Send the registration email
    const url = `${process.env.NEXT_PUBLIC_METADATA_URL}/password/validate/${email}/${resetCode}`;
    await sendMail({
        to: email,
        html: `<a href='${url}'>Click here to reset your password</a>`,
        text: "Open this link to reset your password: " + url,
        subject: "Password Reset Request"
    })

    // Add a log entry
    await addLogEntry(email, 'password-reset', "")

    return {
        status: 'success',
        message: "If this email was registered, you should see reset instructions in your inbox",
        // redirectURL: "/login"
    }
}

export async function passwordResetValidateAction(email: string, code: string, password: string): Promise<ActionResponse> {
    const redisClient = await getRedisClient();
    const redisPasswordResetKey = 'user:' + email.toLowerCase() + ":reset-password";

    const storedCode = await redisClient.get(redisPasswordResetKey);
    if (!storedCode || (storedCode !== code)) {
        console.error('Invalid reset request:', email, storedCode, code);
        // Add an error log entry
        await addLogEntry(email, 'log-in-error', "Invalid reset request")
        return {
            message: "Invalid reset request",
            status: 'error',
        }

    }

    // Delete the reset request
    await redisClient.del(redisPasswordResetKey);

    // Store user in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    const redisLoginKey = 'user:' + email.toLowerCase() + ":login";
    await redisClient.set(redisLoginKey, hashedPassword);

    console.log("Password was reset: ", email)

    // Add a log entry
    await addLogEntry(email, 'password-reset', "Password was reset")

    return {
        status: 'success',
        message: "Password was reset successfully. Please Log in",
        redirectURL: "/login"
    }
}

export async function validateAdminSession() {
    const session = await validateSession();
    const redisClient = await getRedisClient();
    const redisAdminKey = 'user:' + session.email.toLowerCase() + ":admin";
    const adminCheck = await redisClient.get(redisAdminKey);
    if (!adminCheck)
        throw HttpError.Unauthorized("Unauthorized - Admin access required");
}

type LogActionType = 'log-in'
    | 'log-in-error'
    | 'registered'
    | 'register-error'
    | 'log-out'
    | 'password-reset'

export async function addLogEntry(email: string, action: LogActionType, message: string) {
    const redisClient = await getRedisClient();

    // Add a log entry
    const redisAccessLogKey = 'user:' + email.toLowerCase() + ":access-log";
    await redisClient.zAdd(redisAccessLogKey, [
        {
            value: action + ":" + message,
            score: new Date().getTime()
        }
    ])
}
