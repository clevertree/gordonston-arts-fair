export type ValidationType = 'required' | 'phone' | 'email' | 'zipcode';
export type ValidationCallback = (value: string, labelOrFieldName: string) => string | undefined;
export type ValidationTypeList = (ValidationType | ValidationCallback)
| (ValidationType | ValidationCallback)[];

export function validateRequired(value: string, labelOrFieldName: string) {
  if (!value) return `${labelOrFieldName} is a required field`;
  return undefined;
}

export function validatePhone(phoneNumber: string, labelOrFieldName: string = 'Phone Number') {
  if (!phoneNumber) return phoneNumber;
  const match = phoneNumber.match(/(\d{3})-?(\d{3})-?(\d{4})/);
  if (!match) return `Please enter a valid ${labelOrFieldName}`;
  return undefined;
}

export function validateEmail(emailString: string, labelOrFieldName: string = 'Email Address') {
  if (!emailString) return emailString;
  const match = emailString.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (!match) return `Please enter a valid ${labelOrFieldName}`;
  return undefined;
}

export function validateZipcode(zipcodeString: string, labelOrFieldName: string = 'Zipcode') {
  if (!zipcodeString) return zipcodeString;
  const match = zipcodeString.match(/(^\d{5}$)|(^\d{5}-\d{4}$)/);
  if (!match) return `Please enter a valid ${labelOrFieldName}`;
  return undefined;
}

export function validateByType(
  type: ValidationTypeList,
  value: string,
  labelOrFieldName: string
): string | undefined {
  if (Array.isArray(type)) {
    for (let i = 0; i < type.length; i++) {
      const validationCallback = type[i];
      if (typeof validationCallback === 'string') {
        const message = validateByType(validationCallback, value, labelOrFieldName);
        if (message) return message;
      } else {
        const message = validationCallback(value, labelOrFieldName);
        if (message) return message;
      }
    }
    return undefined; // all validation passed
  }

  switch (type) {
    case 'phone':
      return validatePhone(value, labelOrFieldName);
    case 'email':
      return validateEmail(value, labelOrFieldName);
    case 'zipcode':
      return validateZipcode(value, labelOrFieldName);
    case 'required':
      return validateRequired(value, labelOrFieldName);
    default:
      throw new Error(`Invalid validation type: ${type}`);
  }
}
