export function getParamsURL(argsObject: Record<string, any>) {
  const searchParams = new URLSearchParams(argsObject);
  return `?${searchParams.toString()}`;
}

export function snakeCaseToTitleCase(snakeCaseString: string): string {
  if (!snakeCaseString) {
    return '';
  }

  return snakeCaseString
    .split('_') // Split by underscore
    .filter((word) => word.length > 0) // Remove empty strings if multiple underscores
  // Capitalize the first letter and lowercase the rest
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' '); // Join with spaces
}

export interface ISearchArgs<FieldList = string> {
  order?: 'asc' | 'desc',
  orderBy?: FieldList,
  page?: number,
  limit?: number
}
