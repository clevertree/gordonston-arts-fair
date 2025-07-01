import { TextField as MUITextField, TextFieldProps as MUITextFieldProps } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FormFieldProps } from '@components/FormFields/formFieldHooks';
import {
  formatByType, FormatCallback, FormatType, FormatValue
} from '@components/FormFields/formatting';

type TextFieldProps = MUITextFieldProps & FormFieldProps & {
  autoFormat?: FormatType | FormatCallback
};

export default function TextField({
  value: formValue,
  autoFormat = ((s: FormatValue) => s),
  focusRef,
  onUpdate,
  helperTextError,
  ...props
}: TextFieldProps) {
  const [value, setValue] = useState(formValue as string | undefined);

  useEffect(() => {
    setValue(formValue as string | undefined);
  }, [formValue]);

  return (
    <MUITextField
      slotProps={{
        formHelperText: {
          sx: {
            color: helperTextError ? 'red' : undefined
          }
        }
      }}
      inputRef={focusRef}
      value={value}
      {...props}
      onChange={(e) => {
        let newValue;
        if (typeof autoFormat === 'string') {
          newValue = formatByType(autoFormat, e.target.value);
        } else {
          newValue = autoFormat(e.target.value);
        }
        setValue(newValue);
        if (typeof newValue === 'string') {
          e.target.value = newValue;
        }
        if (e.target !== document.activeElement) {
          // Detect autofill
          if (onUpdate) onUpdate(newValue);
        }
        if (props.onChange) props.onChange(e);
      }}
      onBlur={(e) => {
        if (onUpdate) onUpdate(value);
        if (props.onBlur) props.onBlur(e);
      }}
    />
  );
}
