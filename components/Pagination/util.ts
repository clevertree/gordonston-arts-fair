export function getParamsURL(argsObject: Record<string, string>) {
  const searchParams = new URLSearchParams(argsObject);
  return `?${searchParams.toString()}`;
}

export interface ISearchArgs<FieldList = string> {
  order?: 'asc' | 'desc',
  orderBy?: FieldList,
  page?: number,
  limit?: number
}
