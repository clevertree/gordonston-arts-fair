import {login} from "@util/session";

export const dynamic = 'force-dynamic';
export const revalidate = 60 // revalidate every minute

export async function POST(
    req: Request,
) {
    try {
        const id = 'ari@asu.edu';
        // const userContent = {id: 'test'}
        // await sendMail({
        //     to: userEmail,
        //     html: "HTML",
        //     text: "TEXT",
        //     subject: "SUBJECT"
        // })


        // 2. Encrypt the session ID
        const session = await login(id)

        return Response.json(JSON.stringify(session), {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
