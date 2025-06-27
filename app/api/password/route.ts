import {NextRequest} from "next/server";
import {getRedisClient} from "@util/redis";
import {randomBytes} from "node:crypto";
import {sendMail} from "@util/email";

export async function POST(
    request: NextRequest,
) {
    try {
        const {email} = await request.json();
        const redisClient = await getRedisClient();
        const redisLoginKey = 'user:' + email.toLowerCase() + ":login";

        const count = await redisClient.exists(redisLoginKey);
        if (count >= 1) {
            // Store password reset request
            const resetCode = Buffer.from(randomBytes(36)).toString('hex');
            const redisPasswordResetKey = 'user:' + email.toLowerCase() + ":reset-password";
            await redisClient.set(redisPasswordResetKey, resetCode, {EX: 60 * 15})

            console.error("Password reset request: ", email, resetCode)

            // Send the registration email
            const url = `${process.env.NEXT_PUBLIC_METADATA_URL}/password/validate/${email}/${resetCode}`;
            await sendMail({
                to: email,
                html: `<a href='${url}'>Click here to reset your password</a>`,
                text: "Open this link to reset your password: " + url,
                subject: "Password Reset Request"
            })
        } else {
            console.error("User not found for password reset: ", email)
        }

        return Response.json({message: "If this email was registered, you should see reset instructions in your inbox"}, {
            status: 200,
        })

    } catch (error: any) {
        console.error(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
