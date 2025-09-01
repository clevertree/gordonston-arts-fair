'use server';

import {
  Alert,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Link from 'next/link';
import { getFullName, getStatusName } from '@util/profile';
import { UserSearchParams } from '@util/userActions';
import { profileStatuses, UserStatus } from '@types';
import { UserModel } from '@util/models';
import styles from './UserListAdmin.module.css';

interface AdminUserListProps {
  userList: UserModel[],
  // totalCount: number,
  pageCount: number,
  searchParams: UserSearchParams
}

type OrderFieldType = 'email' | 'last_name' | 'created_at' | 'status';

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function UserListAdmin({
  userList,
  // totalCount,
  pageCount,
  searchParams: args = {}
}: AdminUserListProps) {
  const statusOptions: Array<UserStatus | 'all'> = ['all', ...profileStatuses];
  return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography variant="h4" gutterBottom>
        {`${USER_LABEL} Management`}
      </Typography>

      <div className="flex flex-row flex-wrap justify-between items-center">
        Show status:
        <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4" elevation={2}>
          {statusOptions.map((status) => (
            <Link
              key={status}
              href={getSearchStatusURL(args, status)}
              className={status === args.status ? 'font-bold' : ''}
            >
              {ucFirst(status)}
            </Link>
          ))}
        </Paper>
      </div>

      <div className="flex flex-row flex-wrap justify-between items-center">
        Sort by:
        <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4 mb-1" elevation={2}>
          {getSortLink(args, 'email', 'Email')}
          {getSortLink(args, 'last_name', 'Name')}
          {getSortLink(args, 'created_at', 'Created')}
          {getSortLink(args, 'status', 'Status')}
        </Paper>
        <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4" elevation={2}>
          <Link
            href={getParamsURL({ ...args, order: args.order === 'asc' ? 'desc' : 'asc' })}
            className={args.order === 'asc' ? 'font-bold' : ''}
          >
            Ascending
          </Link>
          <Link
            href={getParamsURL({ ...args, order: args.order === 'asc' ? 'desc' : 'asc' })}
            className={args.order === 'desc' ? 'font-bold' : ''}
          >
            Descending
          </Link>
        </Paper>
      </div>

      <div className="flex flex-row flex-wrap justify-between items-center">
        Page:
        <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4" elevation={2}>
          {getPageLinks(args, pageCount)}
        </Paper>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              className="bg-blue-800 [&_th]:bold [&_th]:text-white [&_a]:text-white [&_th]:px-4 [&_th]:py-2"
            >
              <TableCell>{getSortLink(args, 'email', 'Email')}</TableCell>
              <TableCell
                className={styles.hideOnMobile}
              >
                {getSortLink(args, 'last_name', 'Name')}
              </TableCell>
              <TableCell className={styles.hideOnTablet}>Type</TableCell>
              <TableCell
                className={styles.hideOnMobile}
              >
                {getSortLink(args, 'created_at', 'Created')}
              </TableCell>
              <TableCell
                className={styles.hideOnMobile}
              >
                {getSortLink(args, 'status', 'Status')}
              </TableCell>
              <TableCell className={styles.hideOnTablet}>Images</TableCell>
              <TableCell className={styles.hideOnMobile}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map(({
              id,
              first_name, last_name, email,
              type, createdAt, status, uploads
            }) => (
              <TableRow
                key={email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell scope="row">
                  <Link href={`/user/${id}`}>{email}</Link>
                </TableCell>
                <TableCell className={styles.hideOnMobile}>
                  {getFullName(first_name, last_name)}
                </TableCell>
                <TableCell className={styles.hideOnTablet}>
                  {type === 'admin' ? '🔑 Admin' : '🎨 Artist'}
                </TableCell>
                <TableCell className={styles.hideOnMobile}>
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell className={styles.hideOnMobile}>
                  {getStatusName(status)}
                </TableCell>
                <TableCell className={styles.hideOnTablet}>
                  {Object.keys(uploads || {}).length}
                </TableCell>
                <TableCell className={styles.hideOnMobile}>
                  <Link href={`/user/${id}`}>✎</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {userList.length === 0 && (
        <Alert severity="warning">
          No users found.
        </Alert>
      )}

      <div className="flex flex-row flex-wrap justify-between items-center">
        Page:
        <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4" elevation={2}>
          {getPageLinks(args, pageCount)}
        </Paper>
      </div>

    </Box>

  );
}

function getPageLinks(searchParams: UserSearchParams, pageCount: number) {
  const currentPage = searchParams.page || 0;
  const pages = [];
  pages.push(
    (currentPage > 1 ? (
      <Link
        key="previous"
        href={getParamsURL({ ...searchParams, page: currentPage - 1 })}
      >
        Previous
      </Link>
    ) : 'Previous')
  );
  for (let i = 1; i <= pageCount; i++) {
    pages.push(
      <Link
        href={getParamsURL({ ...searchParams, page: i })}
        className={i === currentPage ? 'font-bold' : ''}
        key={i}
      >
        {i}
      </Link>
    );
  }
  pages.push(
    (currentPage < pageCount ? (
      <Link
        key="next"
        href={getParamsURL({ ...searchParams, page: currentPage + 1 })}
      >
        Next
      </Link>
    ) : 'Next')
  );
  return pages;
}

function getSearchStatusURL(searchParams: UserSearchParams, value: UserStatus | 'all') {
  const newParams = { ...searchParams, status: value };
  return getParamsURL(newParams);
}

function getSortLink(searchParams: UserSearchParams, variable: OrderFieldType, title: string) {
  const href = getSortURL(searchParams, variable);
  return (
    <Link
      href={href}
      className={variable === searchParams.orderBy ? 'font-bold' : ''}
    >
      {title}
    </Link>
  );
}

function getSortURL(searchParams: UserSearchParams, variable: OrderFieldType) {
  let {
    order,
    orderBy,
  } = searchParams;
  if (orderBy && orderBy === variable) {
    // If the same variable was hit twice, toggle the order
    order = order === 'asc' ? 'desc' : 'asc';
  }
  switch (variable) {
    case 'email':
    case 'last_name':
    case 'created_at':
    case 'status':
      orderBy = variable;
      break;
    default:
      throw new Error(`Invalid sort param: ${variable}`);
  }
  const newParams = { ...searchParams, order, orderBy };
  return getParamsURL(newParams);
}

function getParamsURL(searchParams: UserSearchParams) {
  const {
    page,
    pageCount,
    status,
    order,
    orderBy
  } = searchParams;
  // eslint-disable-next-line prefer-template
  return `?page=${page}`
      + (pageCount ? `&pageCount=${pageCount}` : '')
      + (status ? `&status=${status}` : '')
      + (order ? `&order=${order}` : '')
      + (orderBy ? `&orderBy=${orderBy}` : '');
}

const ucFirst = (str: string) => {
  if (!str) return str; // Handle empty string or undefined
  return str.charAt(0).toUpperCase() + str.slice(1);
};
