import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';

import { LogEntry } from '@util/logActions';

interface AdminUserLogProps {
  logs: LogEntry[],
  title?: string
}

export default async function UserLogView({ logs, title }: AdminUserLogProps) {
  return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography component="h2" gutterBottom>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-800 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(({
              id, type, message, created_at
            }) => (
              <TableRow
                key={id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" scope="row">
                  {created_at ? created_at.toLocaleString() : 'N/A'}
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
