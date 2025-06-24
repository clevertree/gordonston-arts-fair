import {decryptSession} from "@util/session";
import {NextRequest} from "next/server";
import {isProfileComplete} from "@util/profile";
import {getRedisClient} from "@util/redis";

export async function GET(
    request: NextRequest,
) {
    try {
        const session = await decryptSession();
        if (!session) {
            return Response.json({error: "No active session. Please login"}, {
                status: 401,
            })
        }
        const redisClient = await getRedisClient();
        const profileHash = 'profile:' + session.email.toLowerCase();

        const profileString = await redisClient.get(profileHash);
        const profileData = profileString ? JSON.parse(profileString) : {};
        return Response.json({
            profileData,
            isProfileComplete: isProfileComplete(profileData)
        }, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
        })
    }
}

export async function POST(
    request: NextRequest,
) {
    try {
        const session = await decryptSession();
        if (!session) {
            return Response.json({error: "No active session. Please login"}, {
                status: 401,
            })
        }
        const redisClient = await getRedisClient();
        const profileHash = 'profile:' + session.email.toLowerCase();

        const profileString = await redisClient.get(profileHash);
        const oldProfileData = profileString ? JSON.parse(profileString) : {};
        const newProfileData = await request.json();
        const updatedProfileData = {...oldProfileData, ...newProfileData}
        const putResult = await redisClient.set(profileHash, JSON.stringify(updatedProfileData));

        console.log("Updated user profile:", putResult)
        return Response.json(putResult, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
