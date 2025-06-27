import {TextField as MUITextField, TextFieldProps as MUITextFieldProps} from "@mui/material";
import React, {useEffect, useState} from "react";

type TextFieldValue = string | undefined;

type TextFieldProps = MUITextFieldProps & {
    autoFormat?: (value: TextFieldValue) => TextFieldValue
    helperTextError?: boolean

    focusRef(e: HTMLElement | null): void
    onUpdate(value: string | undefined): void
}

export default function TextField({
                                      value: formValue,
                                      autoFormat = ((s: TextFieldValue) => s),
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
            setValue(autoFormat(e.target.value));
            if (props.onChange) props.onChange(e);
        }}
        onBlur={e => {
            onUpdate(value);
            if (props.onBlur) props.onBlur(e);
        }}
    />
}
// TODO: override helper text color
