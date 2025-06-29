'use client';

import { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import {UserResult} from "@app/api/apiTypes";
import Link from "next/link";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserResult[]>([]);

    const [status, setStatus] = useState<'loading' | 'loaded'| 'error'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setStatus('loading');
                const response = await fetch('/api/admin/user');
                const data = await response.json();
                if (!response.ok) {
                    setStatus('error');
                    setMessage(data.message || 'Failed to fetch users');
                } else {
                    setUsers(data.users);
                    setStatus('loaded');
                    setMessage('');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err instanceof Error ? err.message : 'An error occurred');
            }
        };

        fetchUsers().then();
    }, []);

    if (status === "loading") {
        return (
            <Box p={4}>
                <Typography>Loading users...</Typography>
            </Box>
        );
    }

    if (status === 'error') {
        return (
            <Box p={4}>
                <Typography color="error">Error: {message}</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                User Management
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={(theme) => ({
                            backgroundColor: theme.palette.primary.main,
                            '& th': {
                                fontWeight: 'bold',
                                color: theme.palette.common.white,
                                padding: '0.5rem'
                            }
                        })}>
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Admin</TableCell>
                            <TableCell align="right">Created</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Images</TableCell>
                            <TableCell align="right">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map(({email, isAdmin, createdAt, profile}) => (
                            <TableRow
                                key={email}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    <Link href={`/admin/user/${email}`}>{email}</Link>
                                </TableCell>
                                <TableCell align="center">
                                    {isAdmin ? '✅ Admin' : '👤 User'}
                                </TableCell>
                                <TableCell align="right">
                                    {createdAt
                                        ? new Date(createdAt).toLocaleDateString()
                                        : 'N/A'
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {profile?.info?.firstName||'N/A'} {profile?.info?.lastName || 'N/A'}
                                </TableCell>
                                <TableCell align="center">
                                    {Object.keys(profile?.uploads || {}).length}
                                </TableCell>
                                <TableCell>
                                    <Link href={`/admin/user/${email}`}>✎</Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {users.length === 0 && (
                <Box mt={2}>
                    <Typography color="text.secondary">
                        No users found.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}