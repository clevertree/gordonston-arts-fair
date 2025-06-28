import {TextField as MUITextField, TextFieldProps as MUITextFieldProps} from "@mui/material";
import React, {useEffect, useState} from "react";
import {FormFieldProps} from "@components/FormFields/formFieldHooks";
import {formatByType, FormatCallback, FormatType, FormatValue} from "@components/FormFields/formatting";

type TextFieldProps = MUITextFieldProps & FormFieldProps & {
    autoFormat?: FormatType | FormatCallback
}

export default function TextField({
                                      value: formValue,
                                      autoFormat = ((s: FormatValue) => s),
                                      focusRef,
                                      onUpdate,
                                      helperTextError,
                                      ...props
                                  }: TextFieldProps) {
    const [value, setValue] = useState(formValue as string | undefined)

    useEffect(() => {
        setValue(formValue as string | undefined)
    }, [formValue]);

    return <MUITextField
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
        onChange={e => {
            let value;
            if (typeof autoFormat === 'string') {
                value = formatByType(autoFormat, e.target.value);

            } else {
                value = autoFormat(e.target.value);
            }
            setValue(value);
            if (typeof value === 'string') {
                e.target.value = value;
            }
            if (e.target !== document.activeElement) {
                // Detect autofill
                onUpdate(value)
            }
            if (props.onChange) props.onChange(e);
        }}
        onBlur={e => {
            onUpdate(value);
            if (props.onBlur) props.onBlur(e);
        }}
    />
}
