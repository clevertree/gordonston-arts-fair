'use client';

import React, { useState } from 'react';
import {
  Alert, Box, Button, TextField, Typography
} from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import { validateEmail } from '@components/FormFields/validation';
import { ActionResponse } from '../../types';

interface LoginEmailFormProps {
  loginEmailAction(email: string): Promise<ActionResponse>
}

function LoginEmailForm({
  loginEmailAction
}: LoginEmailFormProps) {
  const [status, setStatus] = useState<'ready' | 'submitting'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['info', 'A code will be sent to your email']);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    const validation = validateEmail(email);
    if (validation) {
      setMessage(['error', validation]);
      return;
    }

    setStatus('submitting');
    setMessage(['info', 'Submitting log-in form...']);

    try {
      const response = await loginEmailAction(email);
      setMessage([response.status, response.message]);
      if (response.redirectURL) document.location.href = response.redirectURL;
    } catch (e: any) {
      setMessage(['error', e.message]);
    } finally {
      setStatus('ready');
    }
  };

  return (
    <form
      method="post"
      onSubmit={handleSubmit}
    >
      <Box
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
        <Typography component="h2" align="center">
          Log in by Email
        </Typography>
        {message && message[1] && (
          <Alert severity={message[0]}>
            {message[1]}
          </Alert>
        )}
        <TextField
          name="email"
          type="email"
          required
          label="Email Number"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          slotProps={{
            inputLabel: {
              shrink: true
            }
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={status === 'submitting'}
        >
          Login
        </Button>
      </Box>
    </form>
  );
}

export default LoginEmailForm;
