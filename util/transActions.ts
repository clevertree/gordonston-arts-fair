/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { getPGSQLClient } from '@util/pgsql';

export type TransactionType = 'charge.succeeded' | 'charge.refunded';

export interface TransactionEntry {
  id :number,
  user_id :number,
  full_name :string,
  email :string,
  phone :string,
  type: TransactionType,
  amount :number,
  created_at :Date,
  content: any
}

export interface TransactionSearchParams {
  type?: TransactionType,
  amount ?: number,
  page?: number,
  pageCount?: number
}
export async function fetchTransactions(userID: number, options: TransactionSearchParams = {}) {
  const sql = getPGSQLClient();
  const { type = null, amount = null } = options;
  return (await sql`SELECT *
                    FROM gaf_transactions
                    WHERE user_id = ${userID}
                    AND (${type}::text IS NULL OR type = ${type})
                    AND (${amount}::int IS NULL OR amount = ${amount})
                    ORDER BY created_at DESC`) as TransactionEntry[];
}

export async function addTransaction(
  userID: number | null,
  type: TransactionType,
  amount: number,
  fullName: string | null,
  email: string | null,
  phone: string | null,
  content: any
) {
  const sql = getPGSQLClient();
  await sql`INSERT INTO gaf_transactions (user_id, type, amount, full_name, phone, email, created_at, content)
              VALUES (${userID}, ${type}, ${amount}, ${fullName}, ${phone}, ${email}, NOW(), ${content})`;
}
