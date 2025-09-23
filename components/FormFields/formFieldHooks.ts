'use client';

import {useState} from 'react';
import {
  validateByType,
  ValidationTypeList
} from '@components/FormFields/validation';
import {formatByType, FormatTypeList} from '@components/FormFields/formatting';

export type FormFieldEvent = {
  target: {
    value: string | undefined | unknown
  }
}

export interface FormFieldProps {
  name: string,
  label: string,
  defaultValue: string,
  color?: 'error' | 'primary',
  helperText?: string,
  helperTextError?: boolean,
  // slotProps?: any,
  required?: boolean,
  scrollIntoView?: boolean,

  onBlur: (e: FormFieldEvent) => void
  onChange: (e: FormFieldEvent) => void
}

export interface ValidationError {
  message: string,
  fieldName: string,

  scrollToField(): void
}

// export type FormDataUpdateCallback<T extends object> = (formData: T) => any;

export interface ValidationState {
  [fieldName: string]: ValidationError | undefined
}

export interface IFormHook<T extends object> {
  // formData: T,
  hasUnsavedData: boolean,
  validationState: ValidationState,
  firstError?: ValidationError,

  // setFieldValue(fieldName: keyof T, value: string): void

  setFieldValue(fieldName: keyof T, value: string): void,

  setupInput(fieldName: keyof T,
    label?: string,
    validate?: ValidationTypeList,
    autoFormat?: FormatTypeList,
  ): FormFieldProps,
}

export interface IFormHookProps<T extends object> {
  formData: T,
  defaultFormData: T,

  setFieldValue(fieldName: keyof T, value: string): void,

  // updateFormData: FormDataUpdateCallback<T>,
  showError: boolean,
}

export function useFormHook<T extends object>(
  {
    formData,
    defaultFormData,
    setFieldValue,
    showError = true,
  }: IFormHookProps<T>
) {
  // if (!defaultFormData) throw new Error('Invalid form data');
  const [autoScrollField, setAutoScrollField] = useState<string | null>(null);
  const [validationState, setValidationState] = useState<ValidationState>({});
  // const formData = useMemo<T>(() => ({ ...defaultFormData }), [defaultFormData]);

  // Check for unsaved data
  let hasUnsavedData = false;
  const formFields = Object.keys(defaultFormData) as (keyof T)[];
  for (let i = 0; i < formFields.length; i++) {
    const key = formFields[i];
    if (Object.prototype.hasOwnProperty.call(defaultFormData, key)) {
      const value = formData[key];
      const defaultValue = defaultFormData[key];
      if (typeof value !== 'object') {
        if ((value || '') !== (defaultValue || '')) {
          hasUnsavedData = true;
        }
      }
    }
  }
  const formHookObject: IFormHook<T> = {
    // formData,
    hasUnsavedData,
    validationState,
    setupInput,
    setFieldValue
    // setFieldValue(fieldName: keyof T, value: string) {
    //   setFieldValue(fieldName, value);
    //   updateFormData(formData);
    // },
  };

  // function setFieldValue(fieldName: keyof T, value: string | undefined) {
  //   if (value !== undefined) {
  //     formData[fieldName] = value as any;
  //   } else {
  //     delete formData[fieldName];
  //   }
  // }

  function setupInput(
    fieldName: Extract<keyof T, string>,
    label?: string,
    validate?: ValidationTypeList,
    autoFormat?: FormatTypeList,
  ) {
    const currentValue = formData[fieldName] as string || '';
    // Validation
    let validationMessage: string | undefined;
    if (validate) {
      validationMessage = validateByType(validate, currentValue, label || fieldName);
    }
    const props: FormFieldProps = {
      name: fieldName,
      label: label || fieldName,
      defaultValue: currentValue,
      onChange: (e) => {
        const { value } = e.target;
        const formattedValue = autoFormat ? formatByType(autoFormat, `${value}`) : value;
        if (formattedValue !== value) e.target.value = `${formattedValue}`;
        setFieldValue(fieldName, `${formattedValue}`);
        if (validate) {
          // Update form data when validation changes
          const newValidationMessage = validateByType(validate, `${formattedValue}`, label || fieldName);
          updateValidationState(newValidationMessage);
        }
      },
      onBlur: (e) => {
        // Update form data if the value changed
        // debugger;
        const {value} = e.target;
        if (typeof value === "string" && defaultFormData[fieldName] !== value) {
          setFieldValue(fieldName, value);
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
