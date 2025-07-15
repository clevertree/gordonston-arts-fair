'use server';

import { getPGSQLClient } from '@util/pgsql';

export type LogType = 'log-in' |
'log-in-error' |
'log-out' |
'register' |
'register-error' |
'message' |
'message-error' |
'status-change';
export type LogEntry = {
  id: number,
  type: LogType,
  message: string,
  created_at: Date,
};

export async function fetchUserLogs(userID: number) {
  const sql = getPGSQLClient();
  return (await sql`SELECT *
                      FROM gaf_user_log
                      WHERE user_id = ${userID}
                      ORDER BY created_at DESC`) as LogEntry[];
}

export async function addUserLogEntry(id: number | null, type: LogType, message: string = '') {
  const sql = getPGSQLClient();
  await sql`INSERT INTO gaf_user_log (user_id, type, message, created_at)
              VALUES (${id}, ${type}, ${message}, NOW())`;
}
