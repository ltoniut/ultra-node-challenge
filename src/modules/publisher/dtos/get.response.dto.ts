import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetPublisherResponseDTO {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  siret: number;

  @Expose()
  phone: string;
}
