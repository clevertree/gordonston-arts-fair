export type FormatType = 'phone';
export type FormatValue = string | undefined;
export type FormatCallback = (value: FormatValue) => FormatValue;
export type FormatTypeList = (FormatType | FormatCallback)
| (FormatType | FormatCallback)[];

export const formatPhone: FormatCallback = (phoneNumber: string | undefined) => {
  if (!phoneNumber) return phoneNumber;
  const match = phoneNumber
    .replace(/\D/g, '')
    .match(/(\d{3})(\d{1,3})?(\d{1,4})?/);
  if (!match) return phoneNumber;
  const [, a, b, c] = match;
  return a + (b ? `-${b}${c ? `-${c}` : ''}` : '');
};

export function formatByType(type: FormatTypeList, value: string | undefined) {
  if (Array.isArray(type)) {
    let formattedValue = value;
    for (let i = 0; i < type.length; i++) {
      const formatCallback = type[i];
      if (typeof formatCallback === 'string') {
        formattedValue = formatByType(formatCallback, formattedValue);
      } else {
        formattedValue = formatCallback(value);
      }
    }
    return formattedValue;
  }

  switch (type) {
    case 'phone':
      return formatPhone(value);
    default:
      throw new Error(`Invalid format type: ${type}`);
  }
}
