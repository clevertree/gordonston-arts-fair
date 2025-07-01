import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';
import { LogEntry } from '@util/userActions';

interface AdminUserLogProps {
  logs: LogEntry[],
  email: string
}

const USER_LABEL = process.env.NEXT_PUBLIC_USER_LABEL || 'User';

export default async function UserLogAdmin({ logs, email }: AdminUserLogProps) {
  return (
    <Box className="flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography component="h2" gutterBottom>
        {USER_LABEL}
        {' '}
        Logs:
        {' '}
        {email}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(({
              type, message, timestamp
            }) => (
              <TableRow
                key={email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" scope="row">
                  {(new Date(timestamp)).toLocaleString()}
                </TableCell>
                <TableCell align="center">
                  {type}
                </TableCell>
                <TableCell align="center">
                  {message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
