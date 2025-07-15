import {
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography
} from '@mui/material';

import { TransactionEntry } from '@util/transActions';

interface AdminUserLogProps {
  transactions: TransactionEntry[],
  title: string
}

export default async function UserTransactionView({ transactions, title }: AdminUserLogProps) {
  return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography component="h2" sx={{ pb: 0 }} gutterBottom>
        {title}
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-500 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Full Name</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Phone</TableCell>
              <TableCell align="center">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(({
              created_at, type, full_name, email, phone, amount
            }) => (
              <TableRow
                key={email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" scope="row">
                  {created_at ? created_at.toLocaleString() : 'N/A'}
                </TableCell>
                <TableCell align="center">
                  {type}
                </TableCell>
                <TableCell align="center">
                  {full_name}
                </TableCell>
                <TableCell align="center">
                  {email}
                </TableCell>
                <TableCell align="center">
                  {phone}
                </TableCell>
                <TableCell align="center">
                  {amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
