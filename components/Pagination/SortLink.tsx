import Link from 'next/link';
import { snakeCaseToTitleCase } from '@util/format';
import { getParamsURL, ISearchArgs } from './util';

export interface ISortLink {
  variable: string,
  title: string,
  args: ISearchArgs,
}

export function SortLink(props: ISortLink) {
  const {
    variable,
    title,
    args,
  } = props;
  let order = args.order || 'asc';
  if (args.orderBy === variable) {
    // If the same variable was hit twice, toggle the order
    order = order === 'asc' ? 'desc' : 'asc';
  }
  const href = getParamsURL({
    ...args,
    order,
    orderBy: variable,
  });
  return (
    <Link
      href={href}
      className={variable === args.orderBy ? 'font-bold' : ''}
    >
      {snakeCaseToTitleCase(title)}
    </Link>
  );
}
