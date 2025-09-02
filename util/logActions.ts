'use server';

import { ensureDatabase } from '@util/database';
import { UserLogModel } from '@util/models';
import type { LogType } from '@types';

export type LogEntry = {
  id: number,
  type: LogType,
  message: string,
  created_at: Date,
};

export interface UserLogSearchParams {
  type?: LogType,
  order?: 'asc' | 'desc',
  orderBy?: string,
  page?: number,
  limit?: number
}
export async function fetchUserLogs(userID: number, searchParams: UserLogSearchParams = {}) {
  await ensureDatabase();

  const {
    type,
    order,
    orderBy = 'id',
    page = 1,
    limit = 10,
  } = searchParams;
  const offset = (page - 1) * limit;

  const logs = await UserLogModel.findAll({
    where: {
      user_id: userID,
      ...(type ? { type } : {})
    },
    order: [[orderBy, order === 'desc' ? 'DESC' : 'ASC']],
    limit,
    offset
  });

  return logs.map((log) => log.toJSON()) as LogEntry[];
}

export async function addUserLogEntry(id: number | null, type: LogType, message: string = '') {
  await ensureDatabase();

  await UserLogModel.create({
    user_id: id,
    type,
    message,
    created_at: new Date()
  });
}
