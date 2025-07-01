'use client';

import { MutableRefObject, useRef } from 'react';
import { validateByType, ValidationCallback, ValidationType } from '@components/FormFields/validation';

export interface FormFieldProps {
  name: string,
  label: string,
  value: string,
  color?: 'error' | 'primary',
  helperText?: string,
  helperTextError?: boolean,
  slotProps?: any,
  required?: boolean,

  focusRef?: (e: HTMLElement | null) => void,

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
    validate?: (ValidationType | ValidationCallback)
    | (ValidationType | ValidationCallback)[]
  ): FormFieldProps,
}

export type FormDataUpdateCallback = (formData: any) => any;

export function useFormHook(
  formData: FormFieldValues,
  updateFormData: FormDataUpdateCallback,
  showError = false
) {
  if (!formData) throw new Error('Invalid form data');
  const fieldRefs = useRef<FormFieldRefs>({});

  const formHookObject: FormHookObject = {
    fieldRefs,
    isValidated: true,
    setupInput,
    setFieldValue,
  };

  function setFieldValue(fieldName: string, value: string | undefined) {
    const newFormData = { ...formData };
    if (value !== undefined) {
      newFormData[fieldName] = value;
    } else {
      delete newFormData[fieldName];
    }
    updateFormData(newFormData);
  }

  function setupInput(
    fieldName: string,
    label?: string,
    validate?: ValidationCallback | ValidationCallback[]
  ) {
    const props: FormFieldProps = {
      name: fieldName,
      label: label || fieldName,
      focusRef: (input: HTMLElement | null) => {
        if (input) {
          fieldRefs.current[fieldName] = input.querySelector('[tabindex="0"]') || input;
        } else {
          delete fieldRefs.current[fieldName];
        }
      },
      value: formData[fieldName] || '',
      onUpdate: (value: string | undefined) => {
        if (value !== formData[fieldName]) {
          setFieldValue(fieldName, value);
        }
      },
    };

    // Validation
    if (validate) {
      let message: string | undefined;
      const validateList: (ValidationType | ValidationCallback)[] = Array.isArray(validate)
        ? validate
        : [validate];
      const value: string = formData[fieldName] || '';
      for (let i = 0; i < validateList.length; i++) {
        const validationCallback = validateList[i];
        const labelOrFieldName = label || fieldName;
        if (typeof validationCallback === 'string') {
          message = validateByType(validationCallback, value, labelOrFieldName);
        } else {
          message = validationCallback(value, labelOrFieldName);
        }
        if (message) break;
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
          };
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
