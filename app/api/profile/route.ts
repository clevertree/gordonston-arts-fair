import {decryptSession} from "@util/session";
import {NextRequest} from "next/server";
import {isProfileComplete, UserProfile} from "@util/profile";
import {getRedisClient} from "@util/redis";
import {list} from "@vercel/blob";

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

        // Get redis client
        const redisClient = await getRedisClient();

        // Get profile data
        const profilePath = 'profile:' + session.email.toLowerCase();
        const profileString = await redisClient.get(profilePath);
        const profileData: UserProfile = profileString ? JSON.parse(profileString) : {};


        const imagePath = 'profile/' + session.email.toLowerCase() + '/uploads';
        const uploadList = await list({
            prefix: imagePath
        })

        for (const upload of uploadList.blobs) {
            const filename = upload.pathname.split('/').pop()
            if (filename) {
                if (!profileData.uploads) {
                    profileData.uploads = {};
                }
                if (!profileData.uploads[filename]) {
                    profileData.uploads[filename] = {
                        title: filename
                    }
                }
                profileData.uploads[filename].url = upload.url;
            }
        }


        // if (profileData.entries) {
        //     for (let entry = 0; entry < profileData.entries.length; entry++) {
        //         const entryData = profileData.entries[entry];
        //         const imagePath = 'profile/' + session.email.toLowerCase() + '/image-' + entry;
        //         console.log("Fetching url for image path: ", imagePath)
        //         try {
        //             const headResult = await head(imagePath);
        //             entryData.url = headResult.url;
        //         } catch (e: any) {
        //             console.error(e.message);
        //         }
        //     }
        // }

        return Response.json({
            uploadList,
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
        return Response.json({message: "Updated user profile successfully"}, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
