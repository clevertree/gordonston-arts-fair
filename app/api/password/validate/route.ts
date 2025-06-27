import {NextRequest} from "next/server";
import {getRedisClient} from "@util/redis";
import bcrypt from "bcrypt";

export async function POST(
    request: NextRequest,
) {
    try {
        const {email, code, password} = await request.json();
        const redisClient = await getRedisClient();
        const redisPasswordResetKey = 'user:' + email.toLowerCase() + ":reset-password";

        const storedCode = await redisClient.get(redisPasswordResetKey);
        if (!storedCode || (storedCode !== code)) {
            console.error('Invalid reset request:', email, storedCode, code);
            return Response.json({error: "Invalid reset request"}, {
                status: 401,
            })
        }

        // Delete the reset request
        await redisClient.del(redisPasswordResetKey);

        // Store user in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const redisLoginKey = 'user:' + email.toLowerCase() + ":login";
        await redisClient.set(redisLoginKey, hashedPassword);

        console.error("Password was reset: ", email)

        return Response.json({message: "Password was reset successfully. Please Log in"}, {
            status: 200,
        })

    } catch (error: any) {
        console.error(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
