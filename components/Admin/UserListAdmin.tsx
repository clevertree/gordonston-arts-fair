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
import { UserResult } from '@util/userActions';
import { getFullName, getStatusName } from '@util/profile';

interface AdminUserListProps {
  userList: UserResult[]
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function UserListAdmin({ userList }: AdminUserListProps) {
  return (
    <Box className="flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography variant="h4" gutterBottom>
        {`${USER_LABEL} Management`}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Admin</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Images</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userList.map(({
              email, isAdmin, createdAt, profile, status
            }) => (
              <TableRow
                key={email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" scope="row">
                  <Link href={`/user/${email}`}>{email}</Link>
                </TableCell>
                <TableCell align="center">
                  {getFullName(profile?.info?.firstName, profile?.info?.lastName)}
                </TableCell>
                <TableCell align="center">
                  {isAdmin ? '🔑 Admin' : '🎨 Artist'}
                </TableCell>
                <TableCell align="center">
                  {createdAt
                    ? new Date(createdAt).toLocaleString()
                    : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {Object.keys(profile?.uploads || {}).length}
                </TableCell>
                <TableCell align="center">
                  {getStatusName(status)}
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
