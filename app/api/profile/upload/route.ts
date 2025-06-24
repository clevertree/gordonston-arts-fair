import {put} from '@vercel/blob';
import {NextRequest, NextResponse} from 'next/server';
import {decryptSession} from "@util/session";

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
    if (!filename) throw new Error("Invalid file name");
    const profileHash = 'profile/' + session.email.toLowerCase() + '/image-0';

    if (!request.body) {
        return NextResponse.json({error: 'Invalid body'});
    }
    const blob = await put(profileHash, request.body, {
        access: 'public',
        contentType
    });
    console.log("Uploaded file: ", filename);
    return NextResponse.json(blob);

}
