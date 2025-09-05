'use server';

import { HttpError, UnauthorizedError } from '@util/exception/httpError';
import { auth, currentUser } from '@clerk/nextjs/server';

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: SessionPayload) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('7d')
//     .sign(encodedKey);
// }
//
// export async function decrypt(session: string | undefined = '') {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ['HS256'],
//     });
//     return payload;
//   } catch (error) {
//     if (error instanceof Error) {
//       throw HttpError.Unauthorized(`Failed to verify session - Please login. Error: ${error.message}`);
//     }
//     throw HttpError.Unauthorized('Failed to verify session - Please login');
//   }
// }

// export async function startSession(userID: number, expiresInDays = 360) {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * expiresInDays);
//
//   const sessionData: SessionPayload = {
//     userID,
//     // expiresAt
//   };
//
//   // Encrypt the session ID
//   const session = await encrypt(sessionData);
//
//   // Store the session in cookies for optimistic auth checks
//   const cookieStore = await cookies();
//   cookieStore.set('session', session, {
//     httpOnly: true,
//     secure: true,
//     expires: expiresAt,
//     sameSite: 'strict',
//     path: '/',
//   });
// }

// export async function endSession() {
//   const session = await decryptSession();
//   const cookieStore = await cookies();
//   cookieStore.delete('session');
//   return session;
// }
//
// export async function decryptSession() {
//   const cookie = (await cookies()).get('session')?.value;
//   return await decrypt(cookie) as SessionPayload;
// }

export async function validateSession() {
  const session = await auth();
  if (!session.isAuthenticated) throw new UnauthorizedError('Unauthorized - Please login');
  return session;
  // const session = await decryptSession();
  // if (!session || !userProfile.id) throw HttpError.Unauthorized('Unauthorized - Please login');
  // return session;
}

export async function validateAdminSession() {
  const session = await validateSession();
  const user = await currentUser();
  if (!user) throw HttpError.Unauthorized('Unauthorized - Please login');
  const userType = user.publicMetadata.type as string | undefined;
  if (userType !== 'admin') throw HttpError.Unauthorized('Unauthorized - Admin access required');
  return session;
}
