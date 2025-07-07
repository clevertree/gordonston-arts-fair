/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { getPGSQLClient } from '@util/pgsql';
import { UserTableRow } from '@util/schema';

export interface UserSearchParams {
  status?: string,
  order?: 'asc' | 'desc',
  orderBy?: string,
  page?: number,
  pageCount?: number
}

export async function listUsersAsAdmin(params: UserSearchParams) {
  const sql = getPGSQLClient();

  const {
    status,
    orderBy,
    order,
    pageCount = 10,
    page = 1
  } = params;

  // Default sort order
  const orderByClause = `ORDER BY ${orderBy || 'id'} ${order || 'desc'}`;
  let whereClause = '';
  if (status && status !== 'all') whereClause = `WHERE status = '${status}'`;
  const pageOffset = page ? page - 1 : 0;
  const [{ count }] = (await sql.query(`SELECT COUNT(*)
                                      FROM gaf_user ${whereClause}`));
  const userList = (await sql.query(`SELECT *
                                     FROM gaf_user ${whereClause} ${orderByClause}
                                     LIMIT ${pageCount} OFFSET ${pageOffset * pageCount}`)) as UserTableRow[];
  return {
    userList,
    totalCount: count,
    pageCount: Math.ceil(count / pageCount)
  };
}

export async function fetchUserID(email: string) {
  const sql = getPGSQLClient();
  const rows = (await sql`SELECT id
                          FROM gaf_user
                          WHERE email = ${email.toLowerCase()}
                          LIMIT 1`) as UserTableRow[];
  if (!rows[0]) throw new Error(`User ID not found: ${email}`);
  return rows[0].id;
}

export async function isAdmin(email: string) {
  const sql = getPGSQLClient();
  const rows = (await sql`SELECT type
                          FROM gaf_user
                          WHERE email = ${email.toLowerCase()}
                          LIMIT 1`) as UserTableRow[];
  if (!rows[0]) throw new Error(`User Admin not found: ${email}`);
  return rows[0].type === 'admin';
}
