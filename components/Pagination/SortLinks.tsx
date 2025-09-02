import { Paper } from '@mui/material';
import Link from 'next/link';
import { SortLink } from '@components/Pagination/SortLink';
import { snakeCaseToTitleCase } from '@util/format';
import { getParamsURL, ISearchArgs } from './util';

export interface ISortLinks<FieldList=string> {
  fieldList: FieldList[],
  args: ISearchArgs<FieldList>,
}

export function SortLinks(props: ISortLinks) {
  const {
    args,
    fieldList,
  } = props;
  return (
    <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4 mb-1" elevation={2}>
      {fieldList.map((fieldName) => (
        <SortLink
          key={fieldName}
          variable={fieldName}
          args={args}
          title={snakeCaseToTitleCase(fieldName)}
        />
      ))}
      <Link
        href={getParamsURL({ ...args, order: args.order === 'asc' ? 'desc' : 'asc' })}
        className={args.order === 'asc' ? 'font-bold' : ''}
      >
        Ascending
      </Link>
      <Link
        href={getParamsURL({ ...args, order: args.order === 'asc' ? 'desc' : 'asc' })}
        className={args.order === 'desc' ? 'font-bold' : ''}
      >
        Descending
      </Link>
    </Paper>
  );
}
