/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { ensureDatabase } from '@util/database';
import { UserFileUploadModel, UserModel } from '@util/models';
import { Op } from 'sequelize';
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
    search,
    orderBy = 'updatedAt',
    order = 'desc',
    limit = 10,
  } = params;
  const page = params.page || 1;

  const offset = (page - 1) * limit;

  const where: any = {
    ...(status && status !== 'all' ? { status } : {}),
  };

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    where[Op.or] = [
      { email: { [Op.iLike]: term } },
      { first_name: { [Op.iLike]: term } },
      { last_name: { [Op.iLike]: term } },
      { company_name: { [Op.iLike]: term } },
      { phone: { [Op.iLike]: term } },
      { phone2: { [Op.iLike]: term } },
    ];
  }

  const result = await UserModel.findAndCountAll({
    include: [{
      model: UserFileUploadModel,
      required: false,
    }],
    distinct: true,
    where,
    order: [[orderBy, order === 'desc' ? 'DESC' : 'ASC']],
    limit,
    offset
  });

  return {
    userList: result.rows.map((user) => user.toJSON()) as UserModel[],
    totalCount: result.count,
    pageCount: Math.ceil(result.count / limit)
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
