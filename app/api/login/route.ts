import {login} from "@util/session";
import {NextRequest} from "next/server";

export const dynamic = 'force-dynamic';
export const revalidate = 60 // revalidate every minute

export async function POST(
    request: NextRequest,
) {
    try {
        const loginRequest = await request.json();
        // const userContent = {id: 'test'}
        // await sendMail({
        //     to: userEmail,
        //     html: "HTML",
        //     text: "TEXT",
        //     subject: "SUBJECT"
        // })


        // 2. Encrypt the session ID
        await login(loginRequest.email.toLowerCase())

        return Response.json({message: "Login successful"}, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
