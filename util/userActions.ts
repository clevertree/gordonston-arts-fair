/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { getRedisClient } from '@util/redis';
import { UserProfile } from '@util/profile';

export type UserList = UserProfile[];

export async function listUsersAsAdmin() {
  // Get Redis client
  const redisClient = await getRedisClient();

  // Get all users by scanning for keys matching the pattern 'user:*:login'
  const users: UserList = [];
  for await (const keys of redisClient.scanIterator({
    MATCH: 'user:*:profile',
    COUNT: 100,
  })) {
    for (const key of keys) {
      const email = key.split(':')[1];
      users.push(await fetchUserResult(email));
    }
  }

  return users;
}

export async function fetchUserResult(email: string): Promise<UserProfile> {
  const emailLC = email.toLowerCase();
  // Get Redis client
  const redisClient = await getRedisClient();
  try {
    // const isAdmin = !!(await redisClient.get(`user:${emailLC}:admin`));
    // const status = (await redisClient.get(`user:${emailLC}:status`)) as UserProfileStatus;
    // const createdAt = await redisClient.get(`user:${emailLC}:createdAt`) || undefined;
    const profile = (await redisClient.json.get(`user:${emailLC}:profile`)) as unknown as UserProfile;
    profile.email = email;
    return profile;
  } catch (e: any) {
    throw Error(`Error fetching user: ${e.message}`);
  }
}

export type LogType = 'access' | 'message' | 'status';
export type LogEntry = {
  type: LogType,
  message: string,
  timestamp: number,
};

export async function fetchUserLogs(email: string) {
  const emailLC = email.toLowerCase();
  const redisClient = await getRedisClient();
  const logs: LogEntry[] = [];

  // Scan for all log entries matching the pattern user:{email}:log:*
  for await (const logEntries of redisClient.hScanIterator(`user:${emailLC}:log`)) {
    for (const logEntry of logEntries) {
      const { value, field: timestamp } = logEntry;
      const [type, message] = value.split(/:(.*)/s);
      const entry: LogEntry = {
        type: type as LogType,
        message,
        timestamp: parseInt(timestamp, 10)
      };
      logs.push(entry);
    }
  }

  // Sort logs by timestamp (assuming logs have ISO date strings)
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}
