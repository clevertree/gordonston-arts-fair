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
import {
  getFullName, getStatusName, UserProfile, UserProfileStatus
} from '@util/profile';

interface AdminUserListProps {
  userList: UserProfile[],
  searchParams: URLSearchParams
}

interface SearchArgs {
  email?: 'asc' | 'desc',
  name?: 'asc' | 'desc',
  isAdmin?: 'asc' | 'desc',
  createdAt?: 'asc' | 'desc',
  status?: UserProfileStatus,
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function UserListAdmin({ userList, searchParams }: AdminUserListProps) {
  function getSearchParams(variable: keyof SearchArgs, title: string) {
    const oldValue = searchParams.get(variable);
    switch (variable) {
      case 'email':
      case 'isAdmin':
      case 'name':
      case 'createdAt':
      case 'status':
        searchParams.set(variable, oldValue === 'asc' ? 'desc' : 'asc');
        return <Link href={`?${searchParams}`}>{title}</Link>;
      default:
        throw new Error(`Invalid search param: ${variable}`);
    }
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
              <TableCell align="center">{getSearchParams('name', 'Name')}</TableCell>
              <TableCell align="center">{getSearchParams('isAdmin', 'Admin')}</TableCell>
              <TableCell align="center">{getSearchParams('createdAt', 'Created')}</TableCell>
              <TableCell align="center">{getSearchParams('status', 'Status')}</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map(({
              email, isAdmin, createdAt, info, status, uploads
            }) => (
              <TableRow
                key={email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" scope="row">
                  <Link href={`/user/${email}`}>{email}</Link>
                </TableCell>
                <TableCell align="center">
                  {getFullName(info.firstName, info.lastName)}
                </TableCell>
                <TableCell align="center">
                  {isAdmin ? '🔑 Admin' : '🎨 Artist'}
                </TableCell>
                <TableCell align="center">
                  {createdAt
                    ? new Date(createdAt).toLocaleDateString()
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
