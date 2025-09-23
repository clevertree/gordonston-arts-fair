export function getParamsURL(argsObject: Record<string, string | number>) {
  const searchParams = new URLSearchParams(argsObject as Record<string, string>);
  return `?${searchParams.toString()}`;
}

export interface ISearchArgs<FieldList = string> {
  order?: 'asc' | 'desc',
  orderBy?: FieldList,
  page?: number,
  limit?: number
}
