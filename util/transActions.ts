/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { ensureDatabase } from '@util/database';
import { TransactionModel } from '@util/models';

export type TransactionType = 'charge.succeeded' | 'charge.refunded';

export interface TransactionEntry {
  id: number,
  user_id: number,
  full_name: string,
  email: string,
  phone: string,
  type: TransactionType,
  amount: number,
  created_at: Date,
  content: any
}

export interface TransactionSearchParams {
  type?: TransactionType,
  amount?: number,
  page?: number,
  pageCount?: number
}

export async function fetchTransactions(userID: number, options: TransactionSearchParams = {}) {
  await ensureDatabase();

  const { type, amount } = options;

  const whereCondition: any = { user_id: userID };
  if (type) whereCondition.type = type;
  if (amount !== undefined && amount !== null) whereCondition.amount = amount;

  const transactions = await TransactionModel.findAll({
    where: whereCondition,
    order: [['created_at', 'DESC']]
  });

  return transactions.map((transaction) => transaction.toJSON()) as TransactionEntry[];
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
  await ensureDatabase();

  await TransactionModel.create({
    user_id: userID,
    type,
    amount,
    full_name: fullName,
    email,
    phone,
    created_at: new Date(),
    content
  });
}
