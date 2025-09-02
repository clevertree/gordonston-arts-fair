import { Button, Paper } from '@mui/material';

export interface IPaginationLinks {
  pageCount: number,
  page: number,
  setPage: (page: number) => void
}

export function PaginationLinks(props: IPaginationLinks) {
  const {
    setPage,
    page = 1,
    pageCount = 1
  } = props;
  return (
    <Paper className="flex flex-row flex-wrap gap-3 p-1 px-4" elevation={2}>
      <Button
        disabled={page <= 1}
        size="x-small"
        variant="contained"
        onClick={() => setPage(page - 1)}
      >
        Previous
      </Button>
      {Array.from({ length: pageCount }, (_, index) => index + 1).map((i) => (
        <Button
          key={i}
          size="x-small"
          variant="contained"
          onClick={() => setPage(i)}
          color={page === i ? 'secondary' : 'primary'}
        >
          {i}
        </Button>
      ))}
      <Button
        disabled={page >= pageCount}
        size="x-small"
        variant="contained"
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </Paper>
  );
}
