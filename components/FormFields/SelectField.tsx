import type {SelectProps} from "@mui/material";
import {FormControl, FormHelperText, InputLabel, Select as MUISelect} from "@mui/material";
import React from "react";

type SelectFieldProps = SelectProps & {
    helperText?: string
    helperTextError?: boolean

    focusRef(e: HTMLElement | null): void,
    onUpdate(value: string | undefined): void
}

export default function SelectField({
                                        helperText,
                                        helperTextError,
                                        required,
                                        onUpdate,
                                        focusRef,
                                        ...props
                                    }: SelectFieldProps) {
    const labelName = props.label + '-label';
    return <FormControl
        required={required}
        fullWidth>
        <InputLabel id={labelName}>{props.label}</InputLabel>
        <MUISelect
            labelId={labelName}
            {...props}
            ref={focusRef}
            onChange={(e, a) => {
                if (props.onChange) props.onChange(e, a);
                onUpdate(e.target.value as string | undefined);
            }}
        />
        {helperText && <FormHelperText sx={{
            color: helperTextError ? 'red' : undefined
        }}>{helperText}</FormHelperText>}
    </FormControl>
}
// TODO: override helper text color
