export type FormatType = 'phone';
export type FormatValue = string | undefined;
export type FormatCallback = (value: FormatValue) => FormatValue;

export const formatPhone: FormatCallback = (phoneNumber: string | undefined) => {
  if (!phoneNumber) return phoneNumber;
  const match = phoneNumber
    .replace(/\D/g, '')
    .match(/(\d{3})(\d{1,3})?(\d{1,4})?/);
  if (!match) return phoneNumber;
  const [, a, b, c] = match;
  return a + (b ? `-${b}${c ? `-${c}` : ''}` : '');
};

export function formatByType(type: FormatType, value: string | undefined) {
  switch (type) {
    case 'phone':
      return formatPhone(value);
  }
  throw new Error(`Invalid format type: ${type}`);
}
