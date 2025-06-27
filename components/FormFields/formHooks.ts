'use client';

import {MutableRefObject, useRef} from "react";

interface InputProps {
    name: string,
    label: string,
    value: string,
    color?: 'error' | 'primary',
    helperText?: string,
    helperTextError?: boolean,
    slotProps?: any,
    required?: boolean,

    focusRef(e: HTMLElement | null): void,

    onUpdate(value: string | undefined): void
}


export interface FormFieldValues {
    [fieldName: string]: string | undefined
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

    setupInput(fieldName: string,
               label?: string,
               validate?: ValidationCallback | ValidationCallback[]
    ): InputProps,
}

export type ValidationCallback = (value: string, labelOrFieldName: string) => string | undefined
export type FormDataUpdateCallback = (formData: any) => any;


export function useFormHook(
    formData: FormFieldValues,
    updateFormData: FormDataUpdateCallback,
    showError = false
) {
    if (!formData)
        throw new Error("Invalid form data")
    const fieldRefs = useRef<FormFieldRefs>({});

    const formHookObject: FormHookObject = {
        fieldRefs,
        isValidated: true,
        setupInput,
        setFieldValue,
    }


    function setFieldValue(fieldName: string, value: string | undefined) {
        const newFormData = {...formData};
        if (value !== undefined) {
            newFormData[fieldName] = value;
        } else {
            delete newFormData[fieldName];
        }
        updateFormData(newFormData)
    }

    function setupInput(
        fieldName: string,
        label?: string,
        validate?: ValidationCallback | ValidationCallback[]
    ) {
        if (!label)
            label = fieldName;

        const props: InputProps = {
            name: fieldName,
            label,
            focusRef: (input: HTMLElement | null) => {
                if (input) {
                    fieldRefs.current[fieldName] = input.querySelector('[tabindex="0"]') || input;
                } else {
                    delete fieldRefs.current[fieldName];
                }
            },
            value: formData[fieldName] || '', // TODO: wrap TextField to deal with defaultValue
            onUpdate: (value: string | undefined) => {
                if (value !== formData[fieldName]) {
                    setFieldValue(fieldName, value);
                }
            },
        }

        // Validation
        if (validate) {
            let message: string | undefined;
            const validateList: ValidationCallback[] = Array.isArray(validate) ? validate : [validate];
            const value: string = formData[fieldName] || "";
            for (const validationCallback of validateList) {
                message = validationCallback(value, label || fieldName)
                if (message)
                    break;
            }
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
                    props.helperTextError = true;
                }
            } else {
                // console.info(fieldName + " passed validation", value)
            }
        }
        return props;
    }

    return formHookObject;
}

export const validateRequired: ValidationCallback = function (value, labelOrFieldName) {
    if (!value)
        return `${labelOrFieldName} is a required field`;
    return undefined;
}

export const validatePhone: ValidationCallback = function (phoneNumber, labelOrFieldName) {
    if (!phoneNumber)
        return phoneNumber;
    const match = phoneNumber.match(/(\d{3})-(\d{3})-(\d{4})/);
    if (!match)
        return "Please enter a valid " + (labelOrFieldName || "Phone Number")
    return undefined;
}

export function formatPhone(phoneNumber: string | undefined) {
    if (!phoneNumber)
        return phoneNumber;
    const match = phoneNumber
        .replace(/\D/g, '')
        .match(/(\d{3})(\d{1,3})?(\d{1,4})?/);
    if (!match)
        return phoneNumber
    const [, a, b, c] = match;
    return a + (b ? '-' + b + (c ? '-' + c : '') : '');
}
