import {validateSession} from "@util/session";
import {NextRequest} from "next/server";
import {getRedisClient} from "@util/redis";
import {validateAdmin} from "@app/api/admin/adminUtil";


export async function POST(
    request: NextRequest,
    {params: {email}}: { params: { email: string } }
) {
    try {
        // Validate Session
        const session = await validateSession();

        // Validate Admin
        await validateAdmin(session.email)

        const {isAdmin} = await request.json();

        const redisClient = await getRedisClient();
        const profileHash = `user:${email.toLowerCase()}:admin`;
        let message: string = '';
        if (isAdmin) {
            message = "User was made an admin: " + email;
            console.log(message)
            await redisClient.set(profileHash, 'true');
        } else {
            message = "User was removed from admin: " + email;
            await redisClient.del(profileHash);
        }
        return Response.json({
            message,
        }, {
            status: 200,
        })

    } catch (error: any) {
        console.error('Error fetching user: ' + email, error);
        return Response.json({error: "Internal server error"}, {
            status: error.statusCode || 500,
        });
    }
}
