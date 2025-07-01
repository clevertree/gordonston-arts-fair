import type { SelectProps as MUISelectProps } from '@mui/material';
import {
  FormControl, FormHelperText, InputLabel, Select as MUISelect
} from '@mui/material';
import React from 'react';
import { FormFieldProps } from '@components/FormFields/formFieldHooks';

type SelectFieldProps = MUISelectProps & FormFieldProps;
export default function SelectField({
  helperText,
  helperTextError,
  required,
  onUpdate,
  focusRef,
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
        {...props}
        ref={focusRef}
        onChange={(e, a) => {
          if (props.onChange) props.onChange(e, a);
          if (onUpdate) onUpdate(e.target.value as string | undefined);
        }}
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
