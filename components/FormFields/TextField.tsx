import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';
import React, { useCallback } from 'react';

type TextFieldProps = MUITextFieldProps & {
  helperTextError?: boolean,
  scrollIntoView?: boolean,
};

export default function TextField({
  scrollIntoView,
  helperTextError,
  ...props
}: TextFieldProps) {
  const onUserNameAnimationStart = useCallback(
    (event: any): void => {
      console.log(event);
      if (event.animationName === 'mui-auto-fill') {
        // Handle autofill event here
        console.log('Username field autofilled!');
      }
    },
    []
  );

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
      onKeyDown={(e) => {
        const inputField = e.target as HTMLInputElement;
        if (e.key === 'Enter' && inputField.form) {
          // Trigger onBlur if an Enter key is pressed
          if (props.onBlur) props.onBlur(e as any);
        }
      }}
      slotProps={{
        input: {
          onAnimationStart: (e: any): void => {
            if (e.animationName === 'mui-auto-fill') {
              console.log(e, props.onChange);
              if (props.onChange) props.onChange(e as any);
            }
          },
        },
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
