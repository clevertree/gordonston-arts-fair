/* eslint-disable no-console */

'use server';

import { endSession, validateSession } from '@util/session';
import { HttpError } from '@util/exception/httpError';
import { isAdmin } from '@util/userActions';
import { addUserLogEntry } from '@util/logActions';
import { ActionResponse } from '../types';

export async function logoutAction(): Promise<ActionResponse> {
  const oldSession = await endSession();
  const { userID } = oldSession;

  // Add a log entry
  await addUserLogEntry(userID, 'log-out');

  return {
    status: 'success',
    message: 'Log out successful. Redirecting...',
    redirectURL: '/login'
  };
}

export async function validateAdminSession() {
  const session = await validateSession();
  if (!await isAdmin(session.userID)) throw HttpError.Unauthorized('Unauthorized - Admin access required');
  return session;
}
