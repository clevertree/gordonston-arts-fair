'use client';

import {MutableRefObject, useRef} from "react";

interface InputProps {
    name: string,
    label: string,
    defaultValue: string,
    color?: 'error' | 'primary',
    helperText?: string,
    slotProps?: any,
    required?: boolean,

    ref(e: HTMLElement | null): void,

    onChange(e: any): void,

    onBlur(e: any): void
}


export interface FormFieldNames {
    [fieldName: string]: string
}

export interface FormFieldRefs {
    [fieldName: string]: HTMLElement
}

export interface FirstError {
    getRef(): HTMLElement,

    message: string,
    fieldName: string
}

export interface FormHookObject {
    fieldRefs: MutableRefObject<FormFieldRefs>,
    isValidated: boolean,
    firstError?: FirstError


    setFieldValue(fieldName: string, value: string): void

    setupInput(fieldName: string, label?: string): InputProps

    setupRequiredInput(fieldName: string,
                       label?: string,
                       validate?: (value: string, fieldName: string, label?: string) => string | undefined): InputProps,
}

export type FormDataUpdateCallback = (formData: any) => any;


export function useFormHook(
    formData: any,
    updateFormData: FormDataUpdateCallback,
    showError = false
) {
    const fieldRefs = useRef<FormFieldRefs>({});

    const formHookObject: FormHookObject = {
        fieldRefs,
        isValidated: true,
        setupInput,
        setupRequiredInput,
        setFieldValue,
    }


    function setFieldValue(fieldName: string, value: string) {
        const newFormData = {...formData};
        newFormData[fieldName] = value;
        updateFormData(newFormData)
    }

    function setupInput(
        fieldName: string,
        label?: string,
        validate?: (value: string, fieldName: string, label?: string) => string | undefined
    ) {
        if (!label)
            label = fieldName;
        let timeout: number = 0;
        const props: InputProps = {
            name: fieldName,
            label,
            ref: (input: HTMLElement | null) => {
                if (input) {
                    fieldRefs.current[fieldName] = input;
                } else {
                    delete fieldRefs.current[fieldName];
                }
            },
            defaultValue: formData[fieldName],
            onBlur: (e: any) => {
                if (timeout)
                    window.clearTimeout(timeout);
                const value = e.target.value;
                if (value !== formData[fieldName]) {
                    setFieldValue(fieldName, e.target.value);
                }
            },
            onChange(e: any) {
                if (validate) {
                    if (timeout)
                        window.clearTimeout(timeout);
                    window.setTimeout(() => {
                        // Update the form values after 1 second timeout
                        const message = validate(e.target.value, fieldName, label);
                        if (!message) {
                            setFieldValue(fieldName, e.target.value);
                        }
                    }, 500)
                }

            }
        }

        // Validation
        if (validate) {
            const value: string = formData[fieldName] || "";
            const message = validate(value, fieldName, label)
            if (message) {
                // const message = label + ' is required'
                // validation[fieldName] = message;
                formHookObject.isValidated = false;
                if (!formHookObject.firstError) {
                    formHookObject.firstError = {
                        message,
                        fieldName,
                        getRef: () => fieldRefs.current[fieldName]
                    }
                    console.warn(message)
                }
                if (showError) {
                    props.color = 'error';
                    props.helperText = message;
                    if (!props.slotProps) props.slotProps = {}
                    if (!props.slotProps.formHelperText) props.slotProps.formHelperText = {}
                    if (!props.slotProps.formHelperText.sx) props.slotProps.formHelperText.sx = {}
                    props.slotProps.formHelperText.sx.color = 'red'
                }
            } else {
                console.info(fieldName + " passed validation", value)
            }
        }
        return props;
    }

    function setupRequiredInput(
        fieldName: string,
        label?: string,
        validate?: (value: string, fieldName: string, label?: string) => string | undefined
    ) {
        const props = setupInput(fieldName, label,
            ((value, fieldName, label) => {
                if (!value)
                    return (label || fieldName) + ' is a required field';
                if (validate)
                    return validate(value, fieldName, label)
            }));
        props.required = true;

        return props;
    }

    return formHookObject;
}

export function validatePhone(phoneNumber: string, fieldName: string, label ?: string) {
    const match = phoneNumber.match(/(\d{3})-(\d{3})-(\d{4})/);
    console.log(fieldName, phoneNumber, match)
    if (!match)
        return "Please enter a valid " + (label || "Phone Number")
    return undefined;
}
