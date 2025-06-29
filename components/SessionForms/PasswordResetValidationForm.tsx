'use client'

import React, {useState} from 'react';
import {Alert, Box, Button, TextField, Typography} from '@mui/material';
import {ActionResponse} from "@util/sessionActions";
import type {AlertColor} from "@mui/material/Alert";

interface PasswordResetValidationFormProps {
    email: string,
    code: string,

    passwordResetValidateAction(email: string, code: string, password: string): Promise<ActionResponse>
}

function PasswordResetValidationForm({
                                         email,
                                         code,
                                         passwordResetValidateAction
                                     }: PasswordResetValidationFormProps) {
    const [status, setStatus] = useState<'ready' | 'submitting' | 'submitted' | 'error'>('ready');
    const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setStatus('submitting');
        setMessage(['info', 'Submitting password reset form...']);

        try {
            const {status, message, redirectURL} = await passwordResetValidateAction(email, code, password);
            setStatus('submitted');
            setMessage([status, message]);
            if (redirectURL)
                document.location.href = redirectURL;

        } catch (e: any) {
            setMessage(['error', e.message]);
        } finally {
            setStatus('ready')
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
                Set a new password
            </Typography>
            {message && message[1] && <Alert severity={message[0]}>
                {message[1]}
            </Alert>}
            <TextField
                required
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                slotProps={{
                    inputLabel: {
                        shrink: true
                    }
                }}
            />
            <Button type="submit" variant="contained" color="primary" disabled={status === 'submitting'}>
                Reset Password
            </Button>
        </Box>
    );
}

export default PasswordResetValidationForm;
