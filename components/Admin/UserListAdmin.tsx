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
import Link from "next/link";
import {UserResult} from "@util/userActions";

interface AdminUserListProps {
    userList: UserResult[]
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default function UserListAdmin({userList}: AdminUserListProps) {
    return (
        <Box className='flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]'>
            <Typography variant="h4" gutterBottom>
                {USER_LABEL} Management
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
                            <TableCell>Email</TableCell>
                            <TableCell align="center">Admin</TableCell>
                            <TableCell align="center">Created</TableCell>
                            <TableCell align="center">Name</TableCell>
                            <TableCell align="center">Images</TableCell>
                            <TableCell align="center">Edit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userList.map(({email, isAdmin, createdAt, profile}) => (
                            <TableRow
                                key={email}
                                sx={{'&:last-child td, &:last-child th': {border: 0}}}
                            >
                                <TableCell component="th" scope="row">
                                    <Link href={`/user/${email}`}>{email}</Link>
                                </TableCell>
                                <TableCell align="center">
                                    {isAdmin ? '🔑 Admin' : '🎨 Artist'}
                                </TableCell>
                                <TableCell align="center">
                                    {createdAt
                                        ? new Date(createdAt).toLocaleString()
                                        : 'N/A'
                                    }
                                </TableCell>
                                <TableCell align="center">
                                    {profile?.info?.firstName || 'N/A'} {profile?.info?.lastName || 'N/A'}
                                </TableCell>
                                <TableCell align="center">
                                    {Object.keys(profile?.uploads || {}).length}
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
                <Alert severity='warning'>
                    No users found.
                </Alert>
            )}
        </Box>
    );
}
