import {put} from "@vercel/blob";

export const dynamic = 'force-dynamic';
export const revalidate = 60 // revalidate every minute

export async function GET(
    req: Request,
) {
    try {
        const userEmail = 'test@email.com';
        const userContent = {id: 'test'}

        const {url} = await put(`artist/profile/${userEmail}`,
            JSON.stringify(userContent),
            {
                access: 'public',
                contentType: 'application/json',
                allowOverwrite: true
            });

        console.log(url)
        return Response.json(url, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json(error, {
            status: 400,
        })
    }
}
