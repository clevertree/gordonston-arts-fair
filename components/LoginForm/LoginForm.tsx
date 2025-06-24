'use client'

import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from '@mui/material';

interface LoginFormProps {
    redirectURL: string,
}

function LoginForm({
                       redirectURL
                   }: LoginFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        const loginRequest = {
            email,
            password
        }
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginRequest),
            })
            setLoading(false);
            // Check if the response was successful (e.g., status code 200-299)
            if (!response.ok) {
                setError(`HTTP error! status: ${response.status}`);
            } else {
                document.location.href = redirectURL;
            }
        } catch (e: any) {
            setError(e.message)
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
                Artist Login
            </Typography>
            {error && <Typography variant="caption" color="red" align="center">
                {error}
            </Typography>}
            <TextField
                label="Email Address"
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
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                Login
            </Button>
        </Box>
    );
}

export default LoginForm;
