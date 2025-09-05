/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { ensureDatabase } from '@util/database';
import { UserFileUploadModel, UserModel } from '@util/models';

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

  const offset = (page - 1) * limit;

  const result = await UserModel.findAndCountAll({
    // attributes: {
    //   include: [
    //     [Sequelize.fn('COUNT', Sequelize.col('UserFileUploadModel.id')), 'uploadCount']
    //   ]
    // },
    include: [{
      model: UserFileUploadModel,
      // as: 'uploads',
      // attributes: [
      //   [Sequelize.fn('COUNT', Sequelize.col('UserFileUploadModel.id')), 'uploadCount']
      //
      // ],
      required: false,
    }],
    where: {
      ...(status && status !== 'all' ? { status } : {}),
    },
    group: ['UserModel.id'],
    order: [[orderBy, order === 'desc' ? 'DESC' : 'ASC']],
    limit,
    offset
  });

  const totalCount = result.count.reduce((sum, groupResult) => sum + groupResult.count, 0);
  return {
    userList: result.rows.map((user) => user.toJSON()) as UserModel[],
    totalCount,
    pageCount: Math.ceil(totalCount / limit)
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
