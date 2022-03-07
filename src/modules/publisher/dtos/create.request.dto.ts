import { IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export default class CreatePublisherRequestDto {
  @IsNotEmpty()
  name: string;

  @IsNumber()
  siret: number;

  @IsPhoneNumber('ZZ')
  phone: string;
}
