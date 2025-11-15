'use client';

import React, {useEffect, useMemo, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import type {AlertColor} from '@mui/material/Alert';
import Link from 'next/link';
import {getFullName, getStatusName} from '@util/profile';
import {MailResult, profileStatuses, UserSearchParams, UserStatus} from '@types';
import {snakeCaseToTitleCase} from '@util/format';
import {IUserSearchResponse} from '@util/userActions';
import {PaginationLinks} from '@components/Pagination/PaginationLinks';
import styles from './UserListAdmin.module.css';
import {exportToExcel} from "@util/export";
import {BookType} from "xlsx";

import Mail from 'nodemailer/lib/mailer';
import SendEmailAdmin from '@components/Admin/SendEmailAdmin';
import UserStatusEditorAdmin from '@components/Admin/UserStatusEditorAdmin';

interface AdminUserListProps {
    listUsersAsAdmin(args: UserSearchParams): Promise<IUserSearchResponse>,

    sendMail?(options: Mail.Options): Promise<MailResult>,

    updateUsersStatusBulk?(userIDs: number[], newStatus: UserStatus, sendTemplate?: boolean): Promise<{
        message: string
    }>,

    // totalCount: number,
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default function UserListAdmin({
                                          listUsersAsAdmin,
                                          sendMail,
                                          updateUsersStatusBulk,
                                      }: AdminUserListProps) {
    const sendMailSafe = sendMail || (async () => ({status: 'error', message: 'sendMail not provided' as const}));
    const updateUsersStatusBulkSafe = updateUsersStatusBulk || (async () => ({message: 'updateUsersStatusBulk not provided'}));
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
        status: undefined,
        limit: 25,
        orderBy: 'updatedAt',
        order: 'desc'
    });
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [actionsAnchorEl, setActionsAnchorEl] = useState<null | HTMLElement>(null);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);

    const allVisibleSelected = useMemo(() => {
        if (userList.length === 0) return false;
        return userList.every(u => selectedIds.has(u.id));
    }, [userList, selectedIds]);

    const someVisibleSelected = useMemo(() => {
        return userList.some(u => selectedIds.has(u.id)) && !allVisibleSelected;
    }, [userList, selectedIds, allVisibleSelected]);
    const [selectAllPending, setSelectAllPending] = useState(false);

    useEffect(() => {
        setMessage(['info', 'Fetching user logs...']);
        try {
            listUsersAsAdmin(args).then((resp) => {
                setData(resp);
                if (selectAllPending) {
                    setSelectedIds(new Set(resp.userList.map(u => u.id)));
                    setSelectAllPending(false);
                }
            }).then(() => setStatus('ready'));
            setMessage(['info', '']);
        } catch (e: unknown) {
            setMessage(['error', (e as Error).message]);
        }
    }, [args, listUsersAsAdmin, selectAllPending]);

    async function exportData(bookType: BookType) {
        const exportedData = await listUsersAsAdmin({
            ...args,
            limit: 99999
        });
        exportToExcel(exportedData.userList, 'export.' + bookType, bookType);
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
                        onClick={() => setArgs({...args, status: undefined})}
                    >
                        All
                    </Button>
                    {profileStatuses.map((value) => (
                        <Button
                            key={value}
                            size="x-small"
                            variant="contained"
                            onClick={() => setArgs({...args, status: value})}
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
                    {['email', 'last_name', 'createdAt', 'updatedAt', 'status'].map((field) => (
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
                        onClick={() => setArgs({...args, order: 'asc'})}
                        color={args.order === 'asc' ? 'secondary' : 'primary'}
                    >
                        Ascending
                    </Button>
                    <Button
                        size="x-small"
                        variant="contained"
                        onClick={() => setArgs({...args, order: 'desc'})}
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
                    setPage={(page: number) => setArgs({...args, page})}
                    pageCount={pageCount}
                />
            </div>

            <div className="flex flex-row flex-wrap justify-between items-center gap-2 my-2">
                <TextField
                    label="Search"
                    placeholder="Name, email, company, phone"
                    size="small"
                    value={args.search || ''}
                    onChange={(e) => setArgs({...args, search: e.target.value, page: 1})}
                />
                <div className="ml-auto flex items-center gap-2">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => setActionsAnchorEl(e.currentTarget)}
                        disabled={selectedIds.size === 0}
                    >
                        Actions
                    </Button>
                    <Menu
                        anchorEl={actionsAnchorEl}
                        open={Boolean(actionsAnchorEl)}
                        onClose={() => setActionsAnchorEl(null)}
                    >
                        <MenuItem onClick={() => {
                            setEmailDialogOpen(true);
                            setActionsAnchorEl(null);
                        }}
                        >Send bulk email template…
                        </MenuItem>
                        <MenuItem onClick={() => {
                            setStatusDialogOpen(true);
                            setActionsAnchorEl(null);
                        }}
                        >Change bulk artist status…
                        </MenuItem>
                    </Menu>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow
                            className="bg-blue-700 [&_th]:bold [&_th]:text-white [&_a]:text-white [&_th]:px-4 [&_th]:py-2"
                        >
                            <TableCell padding="checkbox">
                                <Box className='flex justify-center max-w-[32px]'>
                                    <Checkbox
                                        color="primary"
                                        indeterminate={someVisibleSelected}
                                        checked={allVisibleSelected}
                                        onChange={async (e) => {
                                            const checked = e.target.checked;
                                            if (checked) {
                                                // Want to select all
                                                if (data.totalCount > userList.length) {
                                                    const wantsAll = window.confirm(`Only ${userList.length} of ${data.totalCount} ${USER_LABEL.toLowerCase()}s are loaded. Increase limit to select all filtered users?`);
                                                    if (wantsAll) {
                                                        setSelectAllPending(true);
                                                        setArgs({...args, limit: data.totalCount});
                                                        return;
                                                    }
                                                }
                                                const newSet = new Set(selectedIds);
                                                userList.forEach(u => newSet.add(u.id));
                                                setSelectedIds(newSet);
                                            } else {
                                                // Unselect visible rows
                                                const newSet = new Set(selectedIds);
                                                userList.forEach(u => newSet.delete(u.id));
                                                setSelectedIds(newSet);
                                            }
                                        }}
                                        inputProps={{'aria-label': 'Select all users on page'}}
                                    />

                                </Box>
                            </TableCell>
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
                                className={`${styles.hideOnMobile} cursor-pointer underline hover:text-blue-200`}
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
                                className={`${styles.hideOnTablet} cursor-pointer underline hover:text-blue-200`}
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
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell padding="checkbox">
                                    <Box className='flex justify-center max-w-[60px]'>
                                        <Checkbox
                                            color="primary"
                                            checked={selectedIds.has(id)}
                                            onChange={(e) => {
                                                const newSet = new Set(selectedIds);
                                                if (e.target.checked) newSet.add(id); else newSet.delete(id);
                                                setSelectedIds(newSet);
                                            }}
                                            inputProps={{
                                                'aria-label': `Select ${email}`,
                                            }}
                                        />
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Link href={`/user/${id}`}>
                                        {getFullName(first_name, last_name)}
                                    </Link>
                                </TableCell>
                                <TableCell scope="row" className={styles.hideOnMobile}>
                                    <Link href={`mailto:${email}`} target="_blank">✉</Link>
                                    {` ${email}`}
                                </TableCell>
                                <TableCell className={styles.hideOnTablet}>
                                    {category}
                                </TableCell>
                                <TableCell className={styles.hideOnTablet}>
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
                    setPage={(page: number) => setArgs({...args, page})}
                    pageCount={pageCount}
                />
            </div>
            <Stack spacing={2}>
                <Button variant='contained'
                        color='primary'
                        onClick={() => exportData('xlsx')}
                >
                    Export to excel
                </Button>

                <Button variant='contained'
                        color='primary'
                        onClick={() => exportData('csv')}
                >
                    Export to csv
                </Button>
            </Stack>

            {/* Bulk Email Dialog */}
            <Dialog open={emailDialogOpen} onClose={() => setEmailDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{`Batch Email ${selectedIds.size} ${USER_LABEL}${selectedIds.size === 1 ? '' : 's'}`}</DialogTitle>
                <DialogContent>
                    <SendEmailAdmin
                        sendMail={sendMailSafe}
                        initialEmails={Array.from(selectedIds)
                            .map((id) => userList.find(u => u.id === id)?.email)
                            .filter((e): e is string => !!e)
                            .join(', ')}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEmailDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Bulk Status Dialog */}
            <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{`Change status for ${selectedIds.size} ${USER_LABEL}${selectedIds.size === 1 ? '' : 's'}`}</DialogTitle>
                <DialogContent>
                    <UserStatusEditorAdmin
                        userStatus={profileStatuses[0]}
                        updateUserStatus={async (newStatus, sendTemplate) => {
                            const { message: resultMessage } = await updateUsersStatusBulkSafe(Array.from(selectedIds), newStatus, sendTemplate);
                            return { message: resultMessage };
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
}
