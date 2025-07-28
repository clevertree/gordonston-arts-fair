import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';
import React from 'react';

type TextFieldProps = MUITextFieldProps & {
  helperTextError?: boolean,
  scrollIntoView?: boolean,
  blurTimeout?: number,
};

let globalBlurTimeout: any;
export default function TextField({
  scrollIntoView,
  helperTextError,
  blurTimeout = 1000,
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
          const { value } = inputRef;
          if (value) {
            inputRef.setSelectionRange(value.length, value.length);
          }
        }
      }}
      onKeyDown={(e) => {
        const inputField = e.target as HTMLInputElement;
        if (e.key === 'Enter' && inputField.form) {
          // Trigger onBlur if an Enter key is pressed
          if (props.onBlur) props.onBlur(e as any);
        }
        if (blurTimeout) {
          clearTimeout(globalBlurTimeout);
          globalBlurTimeout = setTimeout(() => {
            if (props.onBlur) {
              console.info('blur timeout reached', props.name, `${inputField.value}`);
              props.onBlur(e as any);
            }
          }, blurTimeout);
        }
      }}
      slotProps={{
        input: {
          onAnimationStart: (e: any): void => {
            const value = `${e.target.value}`;
            if (value && e.animationName === 'mui-auto-fill') {
              if (props.value !== value) {
                console.info('autofill detected', props.name, props.value, value);
                if (props.onChange) props.onChange(e as any);
              }
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
