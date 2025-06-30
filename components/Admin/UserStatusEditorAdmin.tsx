'use client'

import {
    Alert,
    Box,
    Button,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, {useState} from "react";
import {profileStatuses, UserProfileStatus} from "@util/profile";
import type {AlertColor} from "@mui/material/Alert";

interface UserStatusEditorAdminProps {
    userStatus: UserProfileStatus,

    updateUserStatus(newStatus: UserProfileStatus): Promise<{ message: string }>
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default function UserStatusEditorAdmin({userStatus, updateUserStatus}: UserStatusEditorAdminProps) {
    const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);

    return (
        <Box className='flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]'>
            <form action={async (formData) => {
                const status = formData.get('status') as UserProfileStatus;
                const {message} = await updateUserStatus(status);
                setMessage(['success', message]);
            }} method='POST'>
                <Typography variant="h4" gutterBottom>
                    Manage {USER_LABEL} Status
                </Typography>
                {message && message[1] && <Alert severity={message[0]}>
                    {message[1]}
                </Alert>}

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow className='bg-blue-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2'>
                                <TableCell colSpan={2}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell component="th" scope="row">
                                    Status
                                </TableCell>
                                <TableCell>
                                    <Select<UserProfileStatus>
                                        name='status'
                                        fullWidth
                                        variant='outlined'
                                        defaultValue={userStatus}
                                    >
                                        {profileStatuses.map(status => (<MenuItem
                                            key={status}
                                            value={status}
                                        >{status}</MenuItem>))}
                                    </Select>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Button type="submit"
                            variant="contained"
                            color="primary"
                    >
                        Update Status
                    </Button>
                </TableContainer>
            </form>
        </Box>
    );
}
