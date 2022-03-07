import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetFilterDTO {
  @IsOptional()
  @IsString()
  baseUrl?: string;

  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  limit?: number = 20;

  @IsOptional()
  @Transform(parseInt)
  @IsNumber()
  offset?: number = 0;

  @IsOptional()
  @IsString()
  sortField?: string = undefined;

  @IsOptional()
  @IsString()
  sortDir?: 'ASC' | 'DESC' = 'ASC';

  @IsOptional()
  @IsString()
  filterBy?: string;

  @IsOptional()
  @IsString()
  filterValue?: string;
}
