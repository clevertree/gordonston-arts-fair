import {put} from '@vercel/blob';
import {NextRequest, NextResponse} from 'next/server';
import {decryptSession} from "@util/session";
import {getRedisClient} from "@util/redis";
import {UserProfileData} from "@util/profile";

interface FileUploadParams {
    mimetype: string,
    filename: string
}

export async function POST(request: NextRequest) {
    const session = await decryptSession();
    if (!session) {
        return NextResponse.json({error: "No active session. Please login"}, {
            status: 401,
        })
    }
    const {searchParams} = new URL(request.url);
    const contentType = searchParams.get('mimetype');
    if (!contentType) throw new Error("Invalid content type");

    const filename = searchParams.get('filename');
    if (!filename) throw new Error("Invalid file name")

    let entry = searchParams.has('entry') ? parseInt(`${searchParams.get('entry')}`) : 0;


    if (!request.body) {
        return NextResponse.json({error: 'Invalid body'});
    }

    // Get redis client
    const redisClient = await getRedisClient();

    // Get profile data
    const profilePath = 'profile:' + session.email.toLowerCase();
    const profileString = await redisClient.get(profilePath);
    const profileData: UserProfileData = profileString ? JSON.parse(profileString) : {};
    if (!profileData.entries)
        profileData.entries = [];
    if (!entry || profileData.entries.length < entry) {
        entry = profileData.entries.length;
    }
    if (!profileData.entries[entry]) {
        profileData.entries[entry] = {
            title: filename
        }
        // Update profile with new entry
        await redisClient.set(profilePath, JSON.stringify(profileData));
    }

    const imagePath = 'profile/' + session.email.toLowerCase() + '/image-' + entry;

    console.log("Uploading file: ", filename);
    const blob = await put(imagePath, request.body, {
        access: 'public',
        contentType,
        allowOverwrite: true
    });
    return NextResponse.json({
        profileData,
        // blob
    });

}
