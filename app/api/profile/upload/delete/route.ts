import {del} from '@vercel/blob';
import {NextRequest, NextResponse} from 'next/server';
import {decryptSession} from "@util/session";
import {getImageUploadBlobPath} from "@app/api/profile/profileUtil";

interface FileDeleteParams {
    filename: string
}

export async function POST(request: NextRequest) {
    const session = await decryptSession();
    if (!session) {
        return NextResponse.json({error: "No active session. Please login"}, {
            status: 401,
        })
    }
    const requestData: FileDeleteParams = await request.json();
    const {filename} = requestData
    if (!filename) throw new Error("Invalid file name")

    const imagePath = getImageUploadBlobPath(session.email);

    console.log("Deleting file: ", `${imagePath}/${filename}`);
    await del(`${imagePath}/${filename}`);

    // const profileData = await fetchProfileData(session.email);
    // delete profileData.uploads[filename];

    return NextResponse.json({
        message: "File deleted successfully: " + filename,
        // profileData,
        // blob
    });

}
