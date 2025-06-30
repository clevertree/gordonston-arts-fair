export type ValidationType = 'required' | 'phone';
export type ValidationCallback = (value: string, labelOrFieldName: string) => string | undefined;

export const validateRequired: ValidationCallback = (value, labelOrFieldName) => {
  if (!value) return `${labelOrFieldName} is a required field`;
  return undefined;
};

export const validatePhone: ValidationCallback = (phoneNumber, labelOrFieldName) => {
  if (!phoneNumber) return phoneNumber;
  const match = phoneNumber.match(/(\d{3})-(\d{3})-(\d{4})/);
  if (!match) return `Please enter a valid ${labelOrFieldName || 'Phone Number'}`;
  return undefined;
};

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
