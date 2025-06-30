'use client';

import React, { useState } from 'react';
import {
  Alert, Box, Button, Typography
} from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import { ActionResponse } from '@util/sessionActions';

interface LogoutFormProps {
  logoutAction(email: string, password: string): Promise<ActionResponse>
}

function LogoutForm({
  logoutAction
}: LogoutFormProps) {
  const [status, setStatus] = useState<'ready' | 'submitting'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['warning', 'Please submit this form to log out.']);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage(['info', 'Submitting logout form...']);

    try {
      const { message, redirectURL } = await logoutAction(email, password);
      setMessage(['success', message]);
      if (redirectURL) document.location.href = redirectURL;
    } catch (e: any) {
      setMessage(['error', e.message]);
    } finally {
      setStatus('ready');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        padding: 3,
        border: '1px solid #ccc',
        borderRadius: 4,
      }}
    >
      <Typography variant="h6" align="center">
        Artist Logout
      </Typography>
      {message && message[1] && (
      <Alert severity={message[0]}>
        {message[1]}
      </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={status === 'submitting'}
      >
        Logout
      </Button>
    </Box>
  );
}

export default LogoutForm;
