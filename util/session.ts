import 'server-only'
import {JWTPayload, jwtVerify, SignJWT} from 'jose'
import {cookies} from "next/headers";

interface SessionPayload extends JWTPayload {
    email: string,
    // expiresAt: Date
}

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload: SessionPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({alg: 'HS256'})
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}

export async function decrypt(session: string | undefined = '') {
    try {
        const {payload} = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}

export async function login(sessionID: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    const sessionData: SessionPayload = {
        email: sessionID,
        // expiresAt
    };

    // Encrypt the session ID
    const session = await encrypt(sessionData)

    // Store the session in cookies for optimistic auth checks
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'strict',
        path: '/',
    });

    // return sessionData;
}

export async function decryptSession() {
    const cookie = (await cookies()).get('session')?.value
    return await decrypt(cookie) as SessionPayload;
}
