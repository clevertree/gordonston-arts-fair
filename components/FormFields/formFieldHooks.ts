'use client';

import { useMemo } from 'react';
import { validateByType, ValidationTypeList } from '@components/FormFields/validation';
import { formatByType, FormatTypeList } from '@components/FormFields/formatting';

export interface FormFieldProps {
  name: string,
  label: string,
  defaultValue: string,
  color?: 'error' | 'primary',
  helperText?: string,
  helperTextError?: boolean,
  slotProps?: any,
  required?: boolean,
  autoFocus?: boolean,
  scrollIntoView?: boolean,

  // focusRef?: (e: HTMLElement | null) => void,

  onBlur: () => void
  onChange: (e: any) => void
}

export interface FormFieldValues {
  [fieldName: string]: string | undefined
}

export interface FormFieldRefs {
  [fieldName: string]: HTMLElement
}

export interface FirstError {
  // getRef(): HTMLElement,

  message: string,
  fieldName: string
}

export interface FormHookObject {
  // fieldRefs: MutableRefObject<FormFieldRefs>,
  formData: FormFieldValues,
  isValidated: boolean,
  firstError?: FirstError

  setFieldValue(fieldName: string, value: string): void

  setupInput(fieldName: string,
    label?: string,
    validate?: ValidationTypeList,
    autoFormat?:FormatTypeList,

  ): FormFieldProps,
}

export type FormDataUpdateCallback = (formData: any) => any;

export interface FormValues {
  [fieldName: string]: any
}

export function useFormHook(
  defaultFormData: FormValues,
  updateFormData: FormDataUpdateCallback,
  showError = false
) {
  if (!defaultFormData) throw new Error('Invalid form data');
  // const fieldRefs = useRef<FormFieldRefs>({});
  const formData = useMemo<FormValues>(() => ({ ...defaultFormData }), [defaultFormData]);
  const formHookObject: FormHookObject = {
    formData,
    // fieldRefs,
    isValidated: true,
    setupInput,
    setFieldValue,
  };

  function setFieldValue(fieldName: string, value: string | undefined) {
    if (value !== undefined) {
      formData[fieldName] = value;
    } else {
      delete formData[fieldName];
    }
  }

  function setupInput(
    fieldName: string,
    label?: string,
    validate?: ValidationTypeList,
    autoFormat?:FormatTypeList,

  ) {
    const currentValue: string = formData[fieldName] || '';
    // Validation
    let validationMessage: string | undefined;
    if (validate) {
      validationMessage = validateByType(validate, currentValue, label || fieldName);
    }
    const props: FormFieldProps = {
      name: fieldName,
      label: label || fieldName,
      defaultValue: currentValue,
      onChange: (e: any) => {
        const { value } = e.target;
        const formattedValue = autoFormat ? formatByType(autoFormat, value) : value;
        setFieldValue(fieldName, formattedValue);
        if (validate) {
          // Update form data when validation changes
          const newValidationMessage = validateByType(validate, formattedValue, label || fieldName);
          if (newValidationMessage !== validationMessage) {
            console.info('Validation changed: ', newValidationMessage, 'old = ', validationMessage);
            updateFormData(formData);
          }
        }
      },
      onBlur: () => {
        // Update form data if the value changed
        if (JSON.stringify(defaultFormData[fieldName]) !== JSON.stringify(formData[fieldName])) {
          updateFormData(formData);
        }
      }
    };

    // Validation
    if (validationMessage) {
      // const message = label + ' is required'
      // validation[fieldName] = message;
      formHookObject.isValidated = false;
      if (!formHookObject.firstError) {
        formHookObject.firstError = {
          message: validationMessage,
          fieldName,
          // getRef: () => fieldRefs.current[fieldName]
        };
        if (showError) {
          props.autoFocus = true;
          props.scrollIntoView = true;
        }
      }
      if (showError) {
        props.color = 'error';
        props.helperText = validationMessage;
        props.helperTextError = true;
      }
    }
    // console.log(fieldName, props, validate, currentValue, validationMessage);
    return props;
  }

  return formHookObject;
}
