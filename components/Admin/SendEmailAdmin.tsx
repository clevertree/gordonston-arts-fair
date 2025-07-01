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
  TableRow,
  TextField
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { UserProfileStatus } from '@util/profile';
import type { AlertColor } from '@mui/material/Alert';
import Mail from 'nodemailer/lib/mailer';
import { templateList } from '../../template';
import SelectField from '../FormFields/SelectField';

interface SendEmailAdminProps {
  userStatus: UserProfileStatus,
  userEmail: string,

  sendMail(options: Mail.Options): Promise<{ success: boolean; message: string }>,
}

export default function SendEmailAdmin({
  userStatus,
  userEmail,
  sendMail,
}: SendEmailAdminProps) {
  const [status, setStatus] = useState<'ready' | 'submitting'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
  const [email, setEmail] = useState(userEmail);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Box className="flex flex-col min-w-full gap-4 m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <form
        ref={formRef}
        action={async () => {
          setStatus('submitting');
          const { success, message: updateMessage } = await sendMail({
            to: email,
            html: body,
            text: body,
            subject
          });
          setStatus('ready');
          setMessage([success ? 'success' : 'error', updateMessage]);
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
                <TableCell colSpan={2}>Send an email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row">
                  Template
                </TableCell>
                <TableCell>
                  <SelectField
                    name="template"
                    label="Template"
                    fullWidth
                    variant="outlined"
                    value={userStatus || ''}
                    onUpdate={(templateName) => {
                      if (templateName) {
                        const template = templateList.find((t) => t.name === templateName);
                        if (template) {
                          setBody(template.textBody);
                          setSubject(template.subject);
                        }
                      }
                    }}
                  >
                    <MenuItem value="">Load a template</MenuItem>
                    {templateList.map(({ name, subject: subjectString }) => (
                      <MenuItem
                        key={name}
                        value={name}
                      >
                        {subjectString}
                      </MenuItem>
                    ))}
                  </SelectField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Email
                </TableCell>
                <TableCell>
                  <TextField
                    name="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Subject
                </TableCell>
                <TableCell>
                  <TextField
                    name="subject"
                    fullWidth
                    variant="outlined"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Body
                </TableCell>
                <TableCell>
                  <TextField
                    name="body"
                    multiline
                    minRows={8}
                    fullWidth
                    variant="outlined"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell align="right" colSpan={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={status === 'submitting'}
                  >
                    Send Email
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
