import { PipeTransform } from '@nestjs/common';

export class ParseFilterPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/ban-types
  transform(value: any): object {
    const page = value.page ? parseInt(value.page, 10) : 1;
    const limit = value.limit ? parseInt(value.limit, 10) : 20;
    const offset = page === 1 ? 0 : (page - 1) * limit;
    const sortField = value.sortField ? value.sortField : undefined;
    const sortDir = value.sortDir ? value.sortDir : 'ASC';
    const filterBy = value.filterBy ? value.filterBy : '';
    const filterValue = value.filterValue ? value.filterValue : '';

    return {
      ...value,
      page,
      limit,
      offset,
      sortField,
      sortDir,
      filterBy,
      filterValue,
    };
  }
}
