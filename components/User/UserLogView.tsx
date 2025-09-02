'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';

import { UserLogSearchParams } from '@util/logActions';
import { logTypes } from '@types';
import { snakeCaseToTitleCase } from '@util/format';
import { UserLogModel } from '@util/models';

interface UserLogProps {
  fetchUserLogs(args: UserLogSearchParams): Promise<UserLogModel[]>,
  title?: string
}

export default function UserLogView({ fetchUserLogs, title }: UserLogProps) {
  const [logs, setLogs] = useState<UserLogModel[]>([]);
  const [args, setArgs] = useState<UserLogSearchParams>({
    type: 'message',
  });
  useEffect(() => {
    fetchUserLogs(args).then(setLogs);
  }, [args, fetchUserLogs]);
  return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <Typography component="h2" gutterBottom>
        {title}
      </Typography>

      <div className="flex flex-row">
        <Paper className="flex flex-row flex-wrap  gap-1 p-1 mb-1" elevation={2}>
          <Button
            size="x-small"
            variant="contained"
            color={!args.type ? 'secondary' : 'primary'}
            onClick={() => setArgs({ ...args, type: undefined })}
          >
            All
          </Button>
          {logTypes.map((value) => (
            <Button
              key={value}
              size="x-small"
              variant="contained"
              onClick={() => setArgs({ ...args, type: value })}
              color={value === args.type ? 'secondary' : 'primary'}
            >
              {snakeCaseToTitleCase(value)}
            </Button>
          ))}
        </Paper>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow className="bg-blue-700 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
              <TableCell
                className="cursor-pointer underline hover:text-blue-200"
                align="center"
                onClick={() => setArgs({ ...args, order: args.order === 'asc' ? 'desc' : 'asc' })}
              >
                Date
              </TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Message</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map(({
              id, type, message, createdAt
            }) => (
              <TableRow
                key={id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center" scope="row">
                  {createdAt ? createdAt.toLocaleString() : 'N/A'}
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
