import {sendMail} from "@util/email";
import {NextRequest} from 'next/server';
import bcrypt from 'bcrypt';
import {login} from "@util/session";
import {getRedisClient} from "@util/redis";

export async function POST(
    request: NextRequest,
) {
    try {
        const {
            email,
            password
        } = await request.json();
        const hashedPassword = await bcrypt.hash(password, 10);

        const redisClient = await getRedisClient();
        const loginHash = 'user:' + email.toLowerCase() + ":login";

        const count = await redisClient.exists(loginHash);
        if (count >= 1) {
            console.log('User already exists:', email);
            return Response.json({error: "User already exists with this email. Please log in or reset your password"}, {
                status: 401,
            })
        }

        // Store user in the database
        await redisClient.set(loginHash, hashedPassword);

        console.log("Registered a new user: ", email)

        // Create the user session
        await login(email);

        // Send the registration email
        await sendMail({
            to: email,
            html: "HTML",
            text: "TEXT",
            subject: "Registration Complete"
        })

        return Response.json({redirectURL: '/profile'}, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json({error: error.message}, {
            status: 400,
        })
    }
}
