import type {SelectProps} from "@mui/material";
import {FormControl, FormHelperText, InputLabel, Select} from "@mui/material";
import React from "react";

type SelectFieldProps = SelectProps & {
    helperText?: string
}

export default function SelectField({helperText, ...props}: SelectFieldProps) {
    const labelName = props.label + '-label';
    return <FormControl
        required fullWidth>
        <InputLabel id={labelName}>{props.label}</InputLabel>
        <Select
            key={labelName + props.defaultValue}
            labelId={labelName}
            {...props} />
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
}
// TODO: override helper text color
