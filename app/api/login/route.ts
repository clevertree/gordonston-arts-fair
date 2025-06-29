import {login} from "@util/session";
import {NextRequest} from "next/server";
import {getRedisClient} from "@util/redis";
import bcrypt from "bcrypt";

export async function POST(
    request: NextRequest,
) {
    try {
        const {email, password} = await request.json();
        const redisClient = await getRedisClient();
        const redisLoginKey = 'user:' + email.toLowerCase() + ":login";

        const count = await redisClient.exists(redisLoginKey);
        if (count === 0) {
            console.error('User is not registered:', email);
            return Response.json({error: "Invalid email/password combination. Please try again or register before logging in"}, {
                status: 401,
            })
        }

        // Fetch user from the  database
        const passwordHash = await redisClient.get(redisLoginKey);
        const passwordResult = passwordHash && await bcrypt.compare(password, passwordHash);
        if (!passwordResult) {
            console.error('Password is invalid:', email);
            return Response.json({error: "Invalid email/password combination. Please try again or register before logging in"}, {
                status: 401,
            })
        }

        await login(email)

        return Response.json({message: "Login successful"}, {
            status: 200,
        })

    } catch (error: any) {
        console.error(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
