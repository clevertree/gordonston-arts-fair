import {getRedisClient} from "@util/redis";
import {NextRequest} from "next/server";
import {validateSession} from "@util/session";
import {UserProfile} from "@util/profile";
import {validateAdmin} from "@app/api/admin/adminUtil";

export async function GET(
    request: NextRequest,
    {params: {email}}: { params: { email: string } }
) {

    try {
        // Validate Session
        const session = await validateSession();

        // Validate Admin
        await validateAdmin(session.email)

        // Get Redis client
        const redisClient = await getRedisClient();

        const isAdmin = !!(await redisClient.get(`user:${email}:admin`));
        const createdAt = await redisClient.get(`user:${email}:createdAt`) || undefined;
        const profileDataString = await redisClient.get(`user:${email}:profile`);
        const profile: UserProfile = profileDataString ? JSON.parse(profileDataString) : undefined;

        return Response.json({
            isAdmin,
            createdAt,
            profile,
        }, {
            status: 200,
        });

    } catch (error: any) {
        console.error('Error fetching users:', error);
        return Response.json({error: "Internal server error"}, {
            status: error.statusCode || 500,
        });
    }
}
