import type { SelectProps as MUISelectProps } from '@mui/material';
import {
  FormControl, FormHelperText, InputLabel, Select as MUISelect
} from '@mui/material';
import React from 'react';

type SelectFieldProps = MUISelectProps & {
  helperText?: string,
  helperTextError?: boolean,
  scrollIntoView?: boolean,
};
export default function SelectField({
  scrollIntoView,
  helperText,
  helperTextError,
  required,
  onChange,
  onBlur,
  value,
  defaultValue,
  ...props
}: SelectFieldProps) {
  const labelName = `${props.label}-label`;
  return (
    <FormControl
      required={required}
      fullWidth
    >
      <InputLabel id={labelName}>{props.label}</InputLabel>
      <MUISelect
        value={value || defaultValue} // Prevent usage of defaultValue
        labelId={labelName}
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
        onChange={(...args) => {
          if (onChange) onChange(...args);
          if (onBlur) onBlur(args[0] as any);
        }}
        onBlur={onBlur}
        {...props}
      />
      {helperText && (
      <FormHelperText sx={{
        color: helperTextError ? 'red' : undefined
      }}
      >
        {helperText}
      </FormHelperText>
      )}
    </FormControl>
  );
}
