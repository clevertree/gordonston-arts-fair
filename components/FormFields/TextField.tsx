import {
  TextField as MUITextField,
  TextFieldProps as MUITextFieldProps
} from '@mui/material';
import React from 'react';

type TextFieldProps = MUITextFieldProps & {
  helperTextError?: boolean,
  scrollIntoView?: boolean,
  blurTimeout?: number,
};

let globalBlurTimeout: number | undefined;
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
          // @ts-expect-error type mismatch
          if (props.onBlur) props.onBlur(e);
        }
        if (blurTimeout) {
          window.clearTimeout(globalBlurTimeout);
          globalBlurTimeout = window.setTimeout(() => {
            if (props.onBlur) {
              // @ts-expect-error type mismatch
              props.onBlur(e);
            }
          }, blurTimeout);
        }
      }}
      slotProps={{
        input: {
          onAnimationStart: (e): void => {
            // @ts-expect-error missing property
            const value = `${e.target?.value}`;
            if (value && e.animationName === 'mui-auto-fill') {
              if (props.value !== value) {
                // console.info('autofill detected', props.name, props.value, value);
                // @ts-expect-error type mismatch
                if (props.onChange) props.onChange(e);
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
