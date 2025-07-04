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
import { UserTableRow } from '@util/schema';

interface AdminUserListProps {
  userList: UserTableRow[],
  searchParams: URLSearchParams
}

type OrderFieldType = 'email' | 'last_name' | 'created_at' | 'status';

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function UserListAdmin({ userList, searchParams }: AdminUserListProps) {
  function getSearchParams(variable: OrderFieldType, title: string) {
    const orderBy = searchParams.get('orderBy');
    const newParams = new URLSearchParams(`${searchParams}`);
    if (orderBy && orderBy === variable) {
      // If the same variable was hit twice, toggle the order
      newParams.set('order', newParams.get('order') === 'asc' ? 'desc' : 'asc');
    }
    switch (variable) {
      case 'email':
      case 'last_name':
      case 'created_at':
      case 'status':
        newParams.set('orderBy', variable);
        break;
      default:
        throw new Error(`Invalid search param: ${variable}`);
    }
    return <Link href={`?${newParams}`}>{title}</Link>;
  }

  return (
    <Box className="flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography variant="h4" gutterBottom>
        {`${USER_LABEL} Management`}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell align="center">{getSearchParams('email', 'Email')}</TableCell>
              <TableCell align="center">{getSearchParams('last_name', 'Name')}</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">{getSearchParams('created_at', 'Created')}</TableCell>
              <TableCell align="center">{getSearchParams('status', 'Status')}</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map(({
              first_name, last_name, email,
              type, created_at, status, uploads
            }) => (
              <TableRow
                key={email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" scope="row">
                  <Link href={`/user/${email}`}>{email}</Link>
                </TableCell>
                <TableCell align="center">
                  {getFullName(first_name, last_name)}
                </TableCell>
                <TableCell align="center">
                  {type === 'admin' ? '🔑 Admin' : '🎨 Artist'}
                </TableCell>
                <TableCell align="center">
                  {created_at
                    ? new Date(created_at).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {getStatusName(status)}
                </TableCell>
                <TableCell align="center">
                  {Object.keys(uploads || {}).length}
                </TableCell>
                <TableCell align="center">
                  <Link href={`/user/${email}`}>✎</Link>
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
    </Box>
  );
}
