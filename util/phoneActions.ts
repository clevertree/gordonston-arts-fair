'use server';

/* eslint-disable no-console */
// Initialize Stripe with type checking for the secret key

// export async function sendSMSMessage({
//   phone,
//   message,
// }: SMSMessage): Promise<ActionResponse> {
//   if (!process.env.TEXTBEE_API_KEY) {
//     throw new Error('TEXTBEE_API_KEY is not defined');
//   }
//
//   if (!process.env.TEXTBEE_API_URL) {
//     throw new Error('TEXTBEE_API_URL is not defined');
//   }
//
//   const testMode = process.env.TEST_MODE !== 'false';
//   if (!testMode) {
//     const response = await fetch(process.env.TEXTBEE_API_URL, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'x-api-key': process.env.TEXTBEE_API_KEY,
//       },
//       body: JSON.stringify({
//         recipients: [phone],
//         message
//       })
//     });
//     const responseJSON: SMSMessageResult = await response.json();
//     const responseMessage = responseJSON.error
//             || responseJSON?.data?.message
//             || JSON.stringify(responseJSON);
//     if (!responseJSON?.data?.success) {
//       return {
//         status: 'error',
//         message: `Error sending SMS: ${responseMessage}`,
//       };
//     }
//     console.log('SMS sent to', phone, message);
//
//     return {
//       status: 'success',
//       message: responseMessage,
//     };
//   }
//
//   console.log('TEST MODE: No actual SMS was sent');
//   return {
//     status: 'success',
//     message: `TEST MODE: ${message}`,
//   };
// }
//
// interface SMSMessageResult {
//   data?: {
//     success: boolean;
//     message: string;
//     smsBatchId: string;
//     recipientCount: number,
//   }
//   error?: string
//   statusCode?: number
// }

/** Phone Validation * */

// export async function loginPhoneAction(unformattedPhone: string): Promise<ActionResponse> {
//   const phone = unformattedPhone.replace(/\D/g, '');
//   // const redisPasswordResetKey = `user:${phone.toLowerCase()}:reset-password`;
//   // await redisClient.set(redisPasswordResetKey, resetCode, { EX: 60 * 15 });
//   const testMode = process.env.TEST_MODE !== 'false';
//   const twoFactorResult = await fetch2FACode('phone', phone.toLowerCase());
//   if (twoFactorResult) {
//     console.log('Phone 2-Factor re-requested: ', phone, twoFactorResult);
//     return {
//       status: 'success',
//       message: 'A code has been sent to your phone. Please enter it to continue',
//       redirectURL: `/login/validate/phone?phone=${phone}${
//         testMode ? `&code=${twoFactorResult.code}` : ''}`
//     };
//   }
//
//   const loginCode = randomInt(100000, 999999 + 1);
//   const timeout = process.env.TIMEOUT_2FACTOR_MINUTES || '15';
//
//   const validationURL = `${process.env.NEXT_PUBLIC_BASE_URL}/login/validate/phone/?phone=${phone}&code=${loginCode}`;
//   try {
//     const phoneTemplate = User2FactorSMSTemplate(phone, loginCode, validationURL);
//     const phoneRequest = await sendSMSMessage(phoneTemplate);
//     if (phoneRequest.status === 'error') {
//       console.log('SMS Error: ', phoneTemplate.message, phoneRequest);
//       return phoneRequest;
//     }
//     console.log('Sent sms: ', phoneTemplate.message, phoneRequest);
//   } catch (e: any) {
//     console.error('Unable to send sms: ', e.message);
//     return {
//       status: 'error',
//       message: 'Unable to send sms. Please try again later',
//     };
//   }
//
//   // Store validation code
//   await add2FACode('phone', phone, loginCode);
//
//   return {
//     status: 'success',
//     message: 'A code has been sent to your phone. Please enter it to continue',
//     redirectURL: `/login/validate/phone?phone=${phone}${
//       testMode ? `&code=${loginCode}` : ''}`
//   };
// }
//
// export async function loginPhoneValidationAction(
//   phone: string,
//   code: number
// ): Promise<ActionResponse> {
//   const twoFactorResult = await fetch2FACode('phone', phone.toLowerCase());
//   if (!twoFactorResult || (twoFactorResult.code !== code)) {
//     // eslint-disable-next-line no-console
//     console.error('Invalid phone login request:', phone, code, twoFactorResult);
//     // Add an error log entry
//     await addUserUserLogModel(null, 'log-in-error', 'Invalid phone login request');
//     return {
//       message: 'Invalid login request',
//       status: 'error',
//     };
//   }
//
//   // Delete Login Request
//   await delete2FACode('phone', phone);
//
//   await ensureDatabase();
//   // Fetch user from the database
//   const user = await UserModel.findOne({
//     where: { phone },
//     attributes: ['id']
//   });
//
//   let userID: number = -1;
//   if (user) {
//     // User already exists
//     userID = user.id;
//     // Add a log entry
//     await addUserUserLogModel(userID, 'log-in');
//   } else {
//     // Register a new user
//     const newUser = await UserModel.create({
//       phone,
//       type: 'user',
//       status: 'registered',
//       created_at: new Date()
//     });
//     userID = newUser.id;
//     console.log(`Registered a new user (${userID}): `, phone);
//
//     // Add a log entry
//     await addUserUserLogModel(userID, 'register');
//
//     // Send the registration SMS
//     const loginURL = `${process.env.NEXT_PUBLIC_BASE_URL}/login`;
//     const phoneTemplate = UserRegistrationSMSTemplate(phone, loginURL);
//     const smsResult = await sendSMSMessage(phoneTemplate);
//     await addUserUserLogModel(userID, smsResult.status === 'success' ? 'message' : 'message-error', smsResult.message);
//   }
//
//   await startSession(userID);
//
//   // eslint-disable-next-line no-console
//   console.info('User logged in by phone: ', phone);
//   return {
//     status: 'success',
//     message: 'Login successful. Redirecting...',
//     redirectURL: (await isAdmin(userID)) ? '/user' : '/profile'
//   };
// }
