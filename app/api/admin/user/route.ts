import {getRedisClient} from "@util/redis";
import {NextRequest} from "next/server";
import {validateSession} from "@util/session";
import {UserList} from "@app/api/apiTypes";
import {UserProfile} from "@util/profile";
import {validateAdmin} from "@app/api/admin/adminUtil";

export async function GET(
    request: NextRequest,
) {

    try {
        // Validate Session
        const session = await validateSession();

        // Validate Admin
        await validateAdmin(session.email)

        // Get Redis client
        const redisClient = await getRedisClient();


        // Get all users by scanning for keys matching the pattern 'user:*:login'
        const users: UserList = [];
        for await (const [key] of redisClient.scanIterator({
            MATCH: 'user:*:login',
            COUNT: 100
        })) {
            console.log('key', key);
            const email = key.split(':')[1];
            const isAdmin = !!(await redisClient.get(`user:${email}:admin`));
            const createdAt = await redisClient.get(`user:${email}:createdAt`) || undefined;
            const profileDataString = await redisClient.get(`user:${email}:profile`);
            const profile: UserProfile = profileDataString ? JSON.parse(profileDataString) : undefined;

            users.push({
                email,
                isAdmin,
                createdAt,
                profile
            });
        }

        return Response.json({users}, {
            status: 200,
        });

    } catch (error: any) {
        console.error('Error fetching users:', error);
        return Response.json({error: "Internal server error"}, {
            status: error.statusCode || 500,
        });
    }
}
