'use client';

import React, { useEffect, useState } from 'react';
import {
  Alert, Box, Button, TextField, Typography
} from '@mui/material';
import type { AlertColor } from '@mui/material/Alert';
import { ActionResponse } from '@util/sessionActions';

interface LoginValidationFormProps {
  loginValidationAction(code: number): Promise<ActionResponse>,
  defaultCode?: string
}

function LoginValidationForm({
  loginValidationAction,
  defaultCode = ''
}: LoginValidationFormProps) {
  const [status, setStatus] = useState<'ready' | 'submitting'>('ready');
  const [message, setMessage] = useState<[AlertColor, string]>(['info', 'Please enter your 2-factor validation code.']);
  const [code, setCode] = useState(defaultCode);

  useEffect(() => {
    if (defaultCode) {
      tryValidateCode().then();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCode]);

  async function tryValidateCode() {
    try {
      const codeNumber = Number.parseInt(code, 10);
      if (Number.isNaN(codeNumber)) {
        setMessage(['error', 'The code you entered is not a number. Please try again.']);
      } else {
        const response = await loginValidationAction(codeNumber);
        setMessage([response.status, response.message]);
        if (response.redirectURL) document.location.href = response.redirectURL;
      }
    } catch (e: any) {
      setMessage(['error', e.message]);
    } finally {
      setStatus('ready');
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage(['info', 'Submitting log in form...']);

    tryValidateCode().then();
  };

  return (
    <form
      method="post"
      autoComplete="off"
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
          Enter your validation code
        </Typography>
        {message && message[1] && (
          <Alert severity={message[0]}>
            {message[1]}
          </Alert>
        )}
        <TextField
          name="code"
          required
          label="Validation Number"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
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

export default LoginValidationForm;
