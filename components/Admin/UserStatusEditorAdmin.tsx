import {Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import React from "react";
import {UserProfileStatus} from "@util/profile";

interface UserStatusEditorAdminProps {
    userStatus: UserProfileStatus,
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default function UserStatusEditorAdmin({userStatus}: UserStatusEditorAdminProps) {
    return (
        <Box className='flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]'>
            <Typography variant="h4" gutterBottom>
                {USER_LABEL} Status:
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: '#1976d2',
                            '& th': {
                                fontWeight: 'bold',
                                color: 'white',
                                padding: '0.5rem'
                            }
                        }}>
                            <TableCell colSpan={2}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell component="th" scope="row">
                                Status
                            </TableCell>
                            <TableCell>
                                {userStatus || "N/A"}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
