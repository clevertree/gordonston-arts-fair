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
import React, {useRef, useState} from 'react';
import type {AlertColor} from '@mui/material/Alert';
import Mail from 'nodemailer/lib/mailer';
import {useRouter} from 'next/navigation';
import {templateList} from '@template/email';
import {UserModel} from '@util/models';
import {MailResult} from '@types';
import SelectField from '@components/FormFields/SelectField';
import {renderReactNodeToString} from "@util/emailClient";

interface SendEmailAdminProps {
  sendMail(options: Mail.Options): Promise<MailResult>,

  userProfile: UserModel
}

export default function SendEmailAdmin({
  sendMail,
  userProfile
}: SendEmailAdminProps) {
  const { email: userEmail, status: userStatus } = userProfile;
  const [status, setStatus] = useState<'ready' | 'submitting'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
  const [email, setEmail] = useState(userEmail);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  return (
    <Box className="flex flex-col min-w-full m-auto p-6 rounded-2xl border-2 border-[#ccca]">
      <form
        method="post"
        ref={formRef}
        action={async () => {
          setStatus('submitting');

          try {
            const {
              status: updateStatus,
              message: updateMessage
            } = await sendMail({
              to: email,
              // html: body,
              text: body,
              subject
            });
            setMessage([updateStatus, updateMessage]);
          } catch (e: unknown) {
            setMessage(['error', (e as Error).message]);
          }
          setStatus('ready');
          formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
          router.refresh(); // Refresh the current page
        }}
      >
        {message && message[1] && (
        <Alert severity={message[0]}>
          {message[1]}
        </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow className="bg-blue-700 [&_th]:bold [&_th]:text-white [&_th]:px-4 [&_th]:py-2">
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
                    onChange={(e) => {
                      setBody('');
                      setSubject('');
                      const templateID = e.target.value as number;
                      if (templateList[templateID]) {
                        const template = templateList[templateID];
                        if (template) {
                          const {default: MDXComponent} = template;
                          // const emailOptions = getEmailInfo(userProfile.email, template);
                          setBody(renderReactNodeToString(
                              <MDXComponent/>).text);
                          setSubject(`${template.subject}`);
                        } else {
                          setMessage(['error', 'Invalid template ID. Please try again.']);
                        }
                      }
                    }}
                  >
                    <MenuItem value="-1">Load a template</MenuItem>
                    {templateList.map((template, i) => {
                      return (
                        <MenuItem
                            key={template.subject}
                          value={i}
                        >
                          {template.subject}
                        </MenuItem>
                      );
                    })}
                  </SelectField>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row">
                  Send Email To
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
