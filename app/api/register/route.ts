import {sendMail} from "@util/email";
import {NextRequest} from 'next/server';
import bcrypt from 'bcrypt';
import {UserData} from "@util/profile";
import {login} from "@util/session";
import {head, put} from "@vercel/blob"; // or 'bcryptjs'

export async function POST(
    request: NextRequest,
) {
    try {
        const {
            email,
            password
        } = await request.json();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser: UserData = {
            email: email.toLowerCase(),
            password: hashedPassword
        }
        const blobPathLogin = `user/${email}/login`;
        try {
            const existingUser = await head(blobPathLogin);
            console.log('User already exists:', existingUser);
            return Response.json({error: "User already exists with this email. Please log in or reset your password"}, {
                status: 401,
            })
        } catch (e: any) {
            // If no user with this email exists, proceed with registration
        }


        // Store user in the database
        const {url} = await put(blobPathLogin,
            JSON.stringify(newUser),
            {
                access: 'public',
                contentType: 'application/json',
                allowOverwrite: false
            });

        console.log("Registered a new user: ", url, newUser)

        // Create the user session
        await login(email);

        // Send the registration email
        await sendMail({
            to: email,
            html: "HTML",
            text: "TEXT",
            subject: "Registration Complete"
        })

        return Response.json(newUser, {
            status: 200,
        })

    } catch (error: any) {
        console.log(error)
        return Response.json({error: error.message}, {
            status: 400,
        })
    }
}
