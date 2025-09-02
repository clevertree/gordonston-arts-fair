import { Paper } from '@mui/material';
import Link from 'next/link';
import { ISearchArgs } from '@components/Pagination/util';

export interface IPaginationLinks<FieldList=string> {
  // fieldList: FieldList[],
  args: ISearchArgs<FieldList>,
  pageCount: number
}

export function PaginationLinks(props: IPaginationLinks) {
  const {
    args,
    pageCount = 1
  } = props;
  const {
    page = 1
  } = args;
  return (
    <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4" elevation={2}>
      {page > 1 ? (
        <Link
          href={getParamsURL({ ...args, page: page - 1 })}
        >
          Previous
        </Link>
      ) : 'Previous'}
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((i) => (
        <Link
          key={i}
          href={getParamsURL({ ...args, page: i })}
          className={i === page ? 'font-bold' : ''}
        >
          {i}
        </Link>
      ))}
      {page < pageCount ? (
        <Link
          href={getParamsURL({ ...args, page: page + 1 })}
        >
          Next
        </Link>
      ) : 'Next'}
    </Paper>
  );
}

function getParamsURL(argsObject: Record<string, any>) {
  const searchParams = new URLSearchParams(argsObject);
  return `?${searchParams.toString()}`;
}
