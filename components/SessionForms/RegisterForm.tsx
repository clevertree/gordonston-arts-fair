'use client'

import React, {useState} from 'react';
import {Alert, Box, Button, TextField, Typography} from '@mui/material';
import type {AlertColor} from "@mui/material/Alert";
import {ActionResponse} from "@util/sessionActions";

interface RegisterFormProps {
    registerAction(email: string, password: string): Promise<ActionResponse>
}

function RegisterForm({
                          registerAction
                      }: RegisterFormProps) {

    const [status, setStatus] = useState<'loaded' | 'submitting' | 'submitted' | 'error'>('loaded');
    const [message, setMessage] = useState<[AlertColor, string]>(['info', '']);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setStatus('submitting');
        setMessage(['info', 'Submitting form...']);

        try {
            const {message, redirectURL} = await registerAction(email, password);
            setStatus('submitted');
            setMessage(['info', message]);
            document.location.href = redirectURL;
        } catch (e: any) {
            setStatus('error');
            setMessage(e.message);
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
                Register an Artist Account
            </Typography>
            {message && message[1] && <Alert severity={message[0]}>
                {message[1]}
            </Alert>}
            <TextField
                label="Email Address"
                variant="outlined"
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                slotProps={{
                    inputLabel: {
                        shrink: true
                    }
                }}
            />
            <TextField
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

            <Button type="submit" variant="contained" color="primary"
                    disabled={status !== 'loaded' && status !== 'error'}>
                Register
            </Button>
        </Box>
    );
}

export default RegisterForm;
