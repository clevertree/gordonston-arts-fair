/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { getPGSQLClient } from '@util/pgsql';
import { LogEntry } from '@util/logActions';

export async function fetchTransactions(userID: number) {
  const sql = getPGSQLClient();
  return (await sql`SELECT *
                      FROM gaf_transactions
                      WHERE user_id = ${userID}
                      ORDER BY created_at DESC`) as LogEntry[];
}

export async function addTransaction(
  userID: number | null,
  type: string,
  amount: number,
  content: any
) {
  const sql = getPGSQLClient();
  await sql`INSERT INTO gaf_transactions (user_id, type, amount, created_at, content)
              VALUES (${userID}, ${type}, ${amount}, NOW(), ${content})`;
}
