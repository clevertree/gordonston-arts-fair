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
import { profileStatuses } from '@types';
import { UserModel } from '@util/models';
import { PaginationLinks } from '@components/Pagination/PaginationLinks';
import { SortLinks } from '@components/Pagination/SortLinks';
import { EnumLinks } from '@components/Pagination/EnumLinks';
import { UserSearchParams } from '@util/user';
import { SortLink } from '@components/Pagination/SortLink';
import styles from './UserListAdmin.module.css';

interface AdminUserListProps {
  userList: UserModel[],
  // totalCount: number,
  pageCount: number,
  searchParams: UserSearchParams
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default function UserListAdmin({
  userList,
  // totalCount,
  pageCount,
  searchParams: args = {}
}: AdminUserListProps) {
  return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography variant="h4" gutterBottom>
        {`${USER_LABEL} Management`}
      </Typography>

      <div className="flex flex-row flex-wrap justify-between items-center">
        Show status:
        <EnumLinks<UserSearchParams>
          variableName="status"
          valueList={['all', ...profileStatuses]}
          args={args}
        />
      </div>

      <div className="flex flex-row flex-wrap justify-between items-center">
        Sort by:
        <SortLinks
          args={args}
          fieldList={['email', 'last_name', 'created_at', 'status']}
        />
      </div>

      <div className="flex flex-row flex-wrap justify-end items-center">
        <PaginationLinks
          args={args}
          pageCount={pageCount}
        />
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow
              className="bg-blue-700 [&_th]:bold [&_th]:text-white [&_a]:text-white [&_th]:px-4 [&_th]:py-2"
            >
              <TableCell>
                <SortLink
                  variable="email"
                  args={args}
                  title="Email"
                />
              </TableCell>
              <TableCell
                className={styles.hideOnMobile}
              >
                <SortLink
                  variable="last_name"
                  args={args}
                  title="Name"
                />
              </TableCell>
              <TableCell className={styles.hideOnTablet}>Type</TableCell>
              <TableCell
                className={styles.hideOnMobile}
              >
                <SortLink
                  variable="created_at"
                  args={args}
                  title="Created"
                />
              </TableCell>
              <TableCell
                className={styles.hideOnMobile}
              >
                <SortLink
                  variable="status"
                  args={args}
                  title="Status"
                />
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

      <div className="flex flex-row flex-wrap justify-end items-center">
        <PaginationLinks
          args={args}
          pageCount={pageCount}
        />
      </div>

    </Box>

  );
}
