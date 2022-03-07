import {
  IsArray,
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export default class CreateGameRequestDto {
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsOptional()
  price: number;

  @IsArray()
  tags: string[];

  @IsDateString()
  @IsOptional()
  releaseDate: Date | null;

  @IsDefined()
  @IsNumber()
  publisherId: number;
}
