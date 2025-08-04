import {
  Box, Button, Dialog, Stack, SvgIcon, Typography
} from '@mui/material';
import React from 'react';

interface PaymentModalProps {
  text: string,
  title: string,
  open: boolean,
  onClose: () => void,
  onClick: () => void
}

export default function PaymentModal({
  onClick, onClose, open, text, title
}: PaymentModalProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box className="m-auto flex flex-col gap-4 p-4">
        <Stack direction="row" spacing={2} alignItems="center">
          <SvgIcon
            color="success"
            sx={{ fontSize: 48, mb: 1 }}
            className="float-left"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
            />
          </SvgIcon>
          <Typography component="h2" align="center">
            {title}
          </Typography>
        </Stack>
        <Typography variant="body2" align="center">
          {text}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ float: 'right' }}
          onClick={onClick}
        >
          Pay Registration Fee
        </Button>
      </Box>
    </Dialog>
  );
}
