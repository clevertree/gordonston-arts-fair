'use client';

import { useMemo, useState } from 'react';
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
  scrollIntoView?: boolean,

  onBlur: () => void
  onChange: (e: any) => void
}

export interface FormFieldValues {
  [fieldName: string]: string | undefined
}

export interface ValidationError {
  message: string,
  fieldName: string,

  scrollToField(): void
}

export interface FormHookObject {
  formData: FormFieldValues,
  validationState: ValidationState,
  firstError?: ValidationError,

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

export interface ValidationState {
  [fieldName: string]: ValidationError | undefined
}

export function useFormHook(
  defaultFormData: FormValues,
  updateFormData: FormDataUpdateCallback,
  showError: boolean,
) {
  if (!defaultFormData) throw new Error('Invalid form data');
  const [autoScrollField, setAutoScrollField] = useState<string | null>(null);
  const [validationState, setValidationState] = useState<ValidationState>({});
  const formData = useMemo<FormValues>(() => ({ ...defaultFormData }), [defaultFormData]);
  const formHookObject: FormHookObject = {
    formData,
    validationState,
    setupInput,
    setFieldValue(fieldName: string, value: string) {
      setFieldValue(fieldName, value);
      updateFormData(formData);
    },
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
        if (formattedValue !== value) e.target.value = formattedValue;
        setFieldValue(fieldName, formattedValue);
        if (validate) {
          // Update form data when validation changes
          const newValidationMessage = validateByType(validate, formattedValue, label || fieldName);
          updateValidationState(newValidationMessage);
        }
      },
      onBlur: () => {
        // Update form data if the value changed
        if (JSON.stringify(defaultFormData[fieldName]) !== JSON.stringify(formData[fieldName])) {
          updateFormData(formData);
        }
      }
    };

    function updateValidationState(newValidationMessage: string | undefined) {
      if (newValidationMessage) {
        if (!validationState[fieldName]) {
          setValidationState((oldState) => ({
            ...oldState,
            [fieldName]: {
              message: newValidationMessage,
              fieldName,
              scrollToField: () => {
                // console.log('set scrollIntoView', fieldName, currentValue, formData);
                setAutoScrollField(fieldName);
              },
            } as ValidationError
          }));
        }
      } else if (validationState[fieldName]) {
        // Remove resolved validation
        setValidationState((oldState) => ({ ...oldState, [fieldName]: undefined }));
      }
    }

    // Validation
    updateValidationState(validationMessage);
    if (validationMessage) {
      if (formHookObject.firstError === undefined) {
        if (validationState[fieldName]) {
          formHookObject.firstError = validationState[fieldName];
        }
      }
      if (autoScrollField === fieldName) {
        props.scrollIntoView = true;
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
