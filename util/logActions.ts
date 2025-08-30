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

export async function fetchUserLogs(userID: number) {
  await ensureDatabase();

  const logs = await UserLogModel.findAll({
    where: { user_id: userID },
    order: [['created_at', 'DESC']]
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
