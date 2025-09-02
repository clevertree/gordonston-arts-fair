import { Paper } from '@mui/material';
import Link from 'next/link';
import { snakeCaseToTitleCase } from '@util/format';
import { getParamsURL } from './util';

export interface ISearchArgs<FieldList=string> {
  order?: 'asc' | 'desc',
  orderBy?: FieldList,
  // page?: number,
  // limit?: number
}

export interface IEnumLinks<O extends ISearchArgs> {
  variableName: keyof O,
  valueList: string[],
  args: O,
}

export function EnumLinks<O extends ISearchArgs>(props: IEnumLinks<O>) {
  const {
    variableName,
    valueList,
    args,
  } = props;
  return (
    <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4 mb-1" elevation={2}>
      {valueList.map((value) => (
        <Link
          key={value}
          href={getParamsURL({ ...args, [variableName]: value })}
          className={value === args[variableName] ? 'font-bold' : ''}
        >
          {snakeCaseToTitleCase(value)}
        </Link>
      ))}
    </Paper>
  );
}
