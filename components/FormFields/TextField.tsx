import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';
import React from 'react';

type TextFieldProps = MUITextFieldProps & {
  helperTextError?: boolean,
  scrollIntoView?: boolean,
};

export default function TextField({
  scrollIntoView,
  helperTextError,
  ...props
}: TextFieldProps) {
  return (
    <MUITextField
      inputRef={(inputRef) => {
        if (inputRef && inputRef.scrollIntoView && scrollIntoView) {
          inputRef.focus();
          inputRef.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }}
      slotProps={{
        formHelperText: {
          sx: {
            color: helperTextError ? 'red' : undefined
          }
        }
      }}
      {...props}
    />
  );
}
