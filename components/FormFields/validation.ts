export type ValidationType = 'required' | 'phone';
export type ValidationCallback = (value: string, labelOrFieldName: string) => string | undefined;

export function validateRequired(value: string, labelOrFieldName: string) {
  if (!value) return `${labelOrFieldName} is a required field`;
  return undefined;
}

export function validatePhone(phoneNumber: string, labelOrFieldName: string = 'Phone Number') {
  if (!phoneNumber) return phoneNumber;
  const match = phoneNumber.match(/(\d{3})-(\d{3})-(\d{4})/);
  if (!match) return `Please enter a valid ${labelOrFieldName}`;
  return undefined;
}

export function validateEmail(emailString: string, labelOrFieldName: string = 'Email Address') {
  if (!emailString) return emailString;
  const match = emailString.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  if (!match) return `Please enter a valid ${labelOrFieldName}`;
  return undefined;
}

export function validateByType(type: ValidationType, value: string, labelOrFieldName: string) {
  switch (type) {
    case 'phone':
      return validatePhone(value, labelOrFieldName);
    case 'required':
      return validateRequired(value, labelOrFieldName);
    default:
      throw new Error(`Invalid validation type: ${type}`);
  }
}
