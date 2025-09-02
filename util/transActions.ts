/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { ensureDatabase } from '@util/database';
import { UserTransactionModel } from '@util/models';
import { TransactionType } from '@types';

export interface UserTransactionSearchParams {
  type?: TransactionType,
  amount?: number,
  order?: 'asc' | 'desc',
  orderBy?: string,
  page?: number,
  limit?: number
}

export async function fetchTransactions(userID: number, options: UserTransactionSearchParams = {}) {
  await ensureDatabase();

  const { type, amount } = options;

  const whereCondition: any = { user_id: userID };
  if (type) whereCondition.type = type;
  if (amount !== undefined && amount !== null) whereCondition.amount = amount;

  const transactions = await UserTransactionModel.findAll({
    where: whereCondition,
    order: [['createdAt', 'DESC']]
  });

  return transactions.map((transaction) => transaction.toJSON()) as UserTransactionModel[];
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

  await UserTransactionModel.create({
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
