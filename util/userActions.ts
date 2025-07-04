/* eslint-disable no-await-in-loop,no-restricted-syntax */

'use server';

import { getPGSQLClient } from '@util/pgsql';
import { UserTableRow } from '@util/schema';

interface SearchParams {
  status?: string,
  order?: 'asc' | 'desc',
  orderBy?: string,
  page?: number,
  pageCount?: number
}

export async function listUsersAsAdmin(params: SearchParams) {
  const sql = getPGSQLClient();

  const {
    status,
    orderBy,
    order,
    pageCount = 10,
    page = 0
  } = params;

  // Default sort order
  const orderByClause = `ORDER BY ${orderBy || 'id'} ${order || 'desc'}`;
  let whereClause = '';
  if (status && status !== 'all') whereClause = `WHERE status = '${status}'`;

  const response = (await sql.query(`SELECT *
                                     FROM gaf_user ${whereClause} ${orderByClause}
                                     LIMIT ${pageCount} OFFSET ${page * pageCount}`)) as UserTableRow[];
  return response;
}

export async function fetchUserResult(email: string): Promise<UserTableRow> {
  const sql = getPGSQLClient();
  const [userRow] = (await sql`SELECT id,
                                      type,
                                      email,
                                      first_name,
                                      last_name,
                                      company_name,
                                      address,
                                      city,
                                      state,
                                      zipcode,
                                      phone,
                                      phone2,
                                      website,
                                      description,
                                      category,
                                      uploads,
                                      status,
                                      created_at,
                                      updated_at
                               FROM gaf_user
                               WHERE email = ${email.toLowerCase()}
                               LIMIT 1`) as UserTableRow[];
  if (!userRow) throw new Error(`User not found: ${email}`);
  if (!userRow.uploads) userRow.uploads = {};
  return userRow;
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
