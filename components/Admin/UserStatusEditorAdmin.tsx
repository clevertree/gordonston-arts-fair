'use client';

import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { getStatusName } from '@util/profile';
import type { AlertColor } from '@mui/material/Alert';
import { useRouter } from 'next/navigation';
import { SelectField } from '@components/FormFields';
import { profileStatuses, UserStatus } from '@types';

interface UserStatusEditorAdminProps {
  userStatus: UserStatus,

  updateUserStatus(newStatus: UserStatus): Promise<{ message: string }>
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default function UserStatusEditorAdmin({
  userStatus, updateUserStatus
}: UserStatusEditorAdminProps) {
  const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
  const [updatedUserStatus, setUpdatedUserStatus] = useState(userStatus);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <form
        ref={formRef}
        action={async () => {
          const { message: updateMessage } = await updateUserStatus(updatedUserStatus);
          setMessage(['success', updateMessage]);
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          router.refresh(); // Refresh the current page
        }}
        method="POST"
      >
        {message && message[1] && (
        <Alert severity={message[0]}>
          {message[1]}
        </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-blue-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
                <TableCell colSpan={2}>
                  {`Manage ${USER_LABEL} Status`}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Status
                </TableCell>
                <TableCell>
                  <SelectField
                    name="status"
                    label="Select new status"
                    fullWidth
                    variant="outlined"
                    value={updatedUserStatus || ''}
                    onChange={(e: any) => {
                      const { value } = e.target;
                      if (value) setUpdatedUserStatus(value as UserStatus);
                    }}
                  >
                    {profileStatuses.map((status) => (
                      <MenuItem
                        key={status}
                        value={status}
                      >
                        {getStatusName(status)}
                      </MenuItem>
                    ))}
                  </SelectField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" colSpan={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Update Status
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </form>
    </Box>
  );
}
