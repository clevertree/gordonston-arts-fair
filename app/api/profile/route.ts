import {head, put} from "@vercel/blob";
import {decryptSession} from "@util/session";
import {NextRequest} from "next/server";

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
        const userEmail = session.id;

        const headResponse = await head(`user/${userEmail}/profile`);

        const response = await fetch(headResponse.url, {cache: 'no-store'})
        const profileData = await response.json();
        return Response.json(profileData, {
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
        const userEmail = session.id;
        const userContent = await request.json();

        const {url} = await put(`user/${userEmail}/profile`,
            JSON.stringify(userContent),
            {
                access: 'public',
                contentType: 'application/json',
                allowOverwrite: true
            });

        console.log("Updated user profile:", url)
        return Response.json(session, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
