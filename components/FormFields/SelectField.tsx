import type { SelectProps as MUISelectProps } from '@mui/material';
import {
  FormControl, FormHelperText, InputLabel, Select as MUISelect
} from '@mui/material';
import React from 'react';
import { FormFieldProps } from '@components/FormFields/formFieldHooks';

type SelectFieldProps = MUISelectProps & FormFieldProps;
export default function SelectField({
  scrollIntoView,
  helperText,
  helperTextError,
  required,
  onChange,
  onBlur,
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
        labelId={labelName}
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
        onChange={(e:any) => {
          onChange(e);
          onBlur(e);
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
