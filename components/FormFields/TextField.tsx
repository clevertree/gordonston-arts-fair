import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';
import React from 'react';
import { FormFieldProps } from '@components/FormFields/formFieldHooks';
import { FormatCallback, FormatType } from '@components/FormFields/formatting';

type TextFieldProps = MUITextFieldProps & FormFieldProps & {
  autoFormat?: FormatType | FormatCallback
};

export default function TextField({
  scrollIntoView,
  helperTextError,
  ...props
}: TextFieldProps) {
  return (
    <MUITextField
      inputRef={(inputRef) => {
        if (inputRef && scrollIntoView) {
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
