/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { ensureDatabase } from '@util/database';
import { UserModel } from '@util/models';

export interface UserSearchParams {
  status?: string,
  order?: 'asc' | 'desc',
  orderBy?: string,
  page?: number,
  pageCount?: number
}

export async function listUsersAsAdmin(params: UserSearchParams) {
  await ensureDatabase();

  const {
    status,
    orderBy = 'id',
    order = 'desc',
    pageCount = 10,
    page = 1
  } = params;

  const whereCondition = status && status !== 'all' ? { status } : {};
  const pageOffset = (page - 1) * pageCount;

  const { count, rows: userList } = await UserModel.findAndCountAll({
    where: whereCondition,
    order: [[orderBy, order.toUpperCase()]],
    limit: pageCount,
    offset: pageOffset
  });

  return {
    userList: userList.map((user) => user.toJSON()) as UserModel[],
    totalCount: count,
    pageCount: Math.ceil(count / pageCount)
  };
}

export async function fetchUserID(email: string) {
  await ensureDatabase();

  const user = await UserModel.findOne({
    where: { email: email.toLowerCase() },
    attributes: ['id']
  });

  if (!user) throw new Error(`User ID not found: ${email}`);
  return user.id;
}

export async function isAdmin(userID: number) {
  await ensureDatabase();

  const user = await UserModel.findByPk(userID, {
    attributes: ['type']
  });

  if (!user) throw new Error(`User ID not found: ${userID}`);
  return user.type === 'admin';
}
