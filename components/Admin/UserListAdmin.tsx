'use client';

import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import type {AlertColor} from '@mui/material/Alert';
import Link from 'next/link';
import {getFullName, getStatusName} from '@util/profile';
import {profileStatuses, UserSearchParams} from '@types';
import {snakeCaseToTitleCase} from '@util/format';
import {IUserSearchResponse} from '@util/userActions';
import {PaginationLinks} from '@components/Pagination/PaginationLinks';
import styles from './UserListAdmin.module.css';
import {exportToExcel} from "@util/export";
import {BookType} from "xlsx";

interface AdminUserListProps {
  listUsersAsAdmin(args: UserSearchParams): Promise<IUserSearchResponse>,
  // totalCount: number,
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default function UserListAdmin({
  listUsersAsAdmin,
}: AdminUserListProps) {
  const [status, setStatus] = useState<'ready' | 'loading'>('loading');
  const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
  const [data, setData] = useState<IUserSearchResponse>({
    userList: [],
    pageCount: 0,
    totalCount: 0
  });
  const {
    userList,
    pageCount,
  } = data;
  const [args, setArgs] = useState<UserSearchParams>({
    status: 'submitted',
      limit: 25
  });
  useEffect(() => {
    setMessage(['info', 'Fetching user logs...']);
    try {
      listUsersAsAdmin(args).then(setData).then(() => setStatus('ready'));
      setMessage(['info', '']);
    } catch (e: any) {
      setMessage(['error', e.message]);
    }
  }, [args, listUsersAsAdmin]);

    async function exportData(bookType: BookType) {
        const data = await listUsersAsAdmin({
            ...args,
            limit: 99999
        });
        exportToExcel(data.userList, 'export.' + bookType, bookType);
    }

    return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography variant="h4" gutterBottom>
        {`${USER_LABEL} Management`}
      </Typography>

      {message && message[1] && (
      <Alert severity={message[0]}>
        {message[1]}
      </Alert>
      )}

      <div className="flex flex-row flex-wrap justify-between items-center">
        Show status:
        <Paper className="flex flex-row flex-wrap  gap-1 p-1 mb-1" elevation={2}>
          <Button
            size="x-small"
            variant="contained"
            color={!args.status ? 'secondary' : 'primary'}
            onClick={() => setArgs({ ...args, status: undefined })}
          >
            All
          </Button>
          {profileStatuses.map((value) => (
            <Button
              key={value}
              size="x-small"
              variant="contained"
              onClick={() => setArgs({ ...args, status: value })}
              color={value === args.status ? 'secondary' : 'primary'}
            >
              {snakeCaseToTitleCase(value)}
            </Button>
          ))}
        </Paper>
      </div>

      <div className="flex flex-row flex-wrap justify-between items-center">
        Sort by:
        <Paper className="flex flex-row flex-wrap  gap-1 p-1 mb-1" elevation={2}>
          {['email', 'last_name', 'createdAt', 'status'].map((field) => (
            <Button
              key={field}
              size="x-small"
              variant="contained"
              onClick={() => setArgs({
                ...args,
                orderBy: field,
                order: args.orderBy === field && args.order === 'asc' ? 'desc' : 'asc'
              })}
              color={field === args.orderBy ? 'secondary' : 'primary'}
            >
              {snakeCaseToTitleCase(field)}
            </Button>
          ))}
          <Button
            size="x-small"
            variant="contained"
            onClick={() => setArgs({ ...args, order: 'asc' })}
            color={args.order === 'asc' ? 'secondary' : 'primary'}
          >
            Ascending
          </Button>
          <Button
            size="x-small"
            variant="contained"
            onClick={() => setArgs({ ...args, order: 'desc' })}
            color={args.order === 'desc' ? 'secondary' : 'primary'}
          >
            Descending
          </Button>
        </Paper>
      </div>

      <div className="flex flex-row flex-wrap justify-between items-center">
        {`Page ${args.page || 1} of ${pageCount} (Total Users: ${data.totalCount})`}
        <PaginationLinks
          page={args.page || 1}
          setPage={(page:number) => setArgs({ ...args, page })}
          pageCount={pageCount}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              className="bg-blue-700 [&_th]:bold [&_th]:text-white [&_a]:text-white [&_th]:px-4 [&_th]:py-2"
            >
              <TableCell
                className="cursor-pointer underline hover:text-blue-200"
                onClick={() => setArgs({
                  ...args,
                    orderBy: 'last_name',
                    order: args.orderBy === 'last_name' && args.order === 'asc' ? 'desc' : 'asc'
                })}
              >
                  Full Name
              </TableCell>
              <TableCell
                className="cursor-pointer underline hover:text-blue-200"
                onClick={() => setArgs({
                  ...args,
                    orderBy: 'email',
                    order: args.orderBy === 'email' && args.order === 'asc' ? 'desc' : 'asc'
                })}
              >
                  Email
              </TableCell>
              <TableCell className={styles.hideOnTablet}>Category</TableCell>
              <TableCell
                className={`${styles.hideOnMobile} cursor-pointer underline hover:text-blue-200`}
                onClick={() => setArgs({
                  ...args,
                  orderBy: 'updatedAt',
                  order: args.orderBy === 'updatedAt' && args.order === 'asc' ? 'desc' : 'asc'
                })}
              >
                Updated
              </TableCell>
              <TableCell
                className={`${styles.hideOnMobile} cursor-pointer underline hover:text-blue-200`}
                onClick={() => setArgs({
                  ...args,
                  orderBy: 'status',
                  order: args.orderBy === 'status' && args.order === 'asc' ? 'desc' : 'asc'
                })}
              >
                Status
              </TableCell>
              <TableCell className={styles.hideOnTablet}>Images</TableCell>
                <TableCell className={styles.hideOnMobile}>Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map(({
              id,
              first_name, last_name, email,
              category, updatedAt, status: userStatus, uploads
            }) => (
              <TableRow
                key={email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                  <TableCell className={styles.hideOnMobile}>
                      <Link href={`/user/${id}`} target="_blank">
                          {getFullName(first_name, last_name)}
                      </Link>
                  </TableCell>
                <TableCell scope="row">
                    <Link href={`mailto:${email}`} target="_blank">✉</Link>
                    {` ${email}`}
                </TableCell>
                <TableCell className={styles.hideOnTablet}>
                  {category}
                </TableCell>
                <TableCell className={styles.hideOnMobile}>
                  {updatedAt
                    ? new Date(updatedAt).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell className={styles.hideOnMobile}>
                  {getStatusName(userStatus)}
                </TableCell>
                <TableCell className={styles.hideOnTablet}>
                  <Link href={`/user/${id}`}>{uploads.length}</Link>
                </TableCell>
                <TableCell className={styles.hideOnMobile}>
                  <Link href={`/user/${id}`}>✎</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {status === 'ready' && userList.length === 0 && (
        <Alert severity="info">
          No users found.
        </Alert>
      )}
      {status === 'loading' && (
        <Alert severity="info">
          Querying Users...
        </Alert>
      )}

      <div className="flex flex-row flex-wrap justify-between items-center">
        {`Page ${args.page || 1} of ${pageCount} (Total Users: ${data.totalCount})`}
        <PaginationLinks
          page={args.page || 1}
          setPage={(page:number) => setArgs({ ...args, page })}
          pageCount={pageCount}
        />
      </div>
        <Stack spacing={2}>
            <Button variant='contained'
                    color='primary'
                    onClick={() => exportData('xlsx')}>
                Export to excel
            </Button>

            <Button variant='contained'
                    color='primary'
                    onClick={() => exportData('csv')}>
                Export to csv
            </Button>
        </Stack>
    </Box>

  );
}
