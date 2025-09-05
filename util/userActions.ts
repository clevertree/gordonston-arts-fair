/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { ensureDatabase } from '@util/database';
import { UserModel } from '@util/models';

import { UserSearchParams } from '@types';

export interface IUserSearchResponse {
  userList: UserModel[];
  totalCount: number;
  pageCount: number;
}
export async function listUsersAsAdmin(params: UserSearchParams) {
  await ensureDatabase();

  const {
    status,
    orderBy = 'id',
    order = 'desc',
    limit = 10,
  } = params;
  const page = params.page || 1;

  const whereCondition = status && status !== 'all' ? { status } : {};
  const offset = (page - 1) * limit;

  const { count, rows: userList } = await UserModel.findAndCountAll({
    where: whereCondition,
    order: [[orderBy, order === 'desc' ? 'DESC' : 'ASC']],
    limit,
    offset
  });

  return {
    userList: userList.map((user) => user.toJSON()) as UserModel[],
    totalCount: count,
    pageCount: Math.ceil(count / limit)
  } as IUserSearchResponse;
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
