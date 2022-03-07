import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class GetGameResponseDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  publisher: string;

  @Expose()
  price: number;

  @Expose()
  tags: string[];

  @Expose()
  releaseDate: Date | null;
}
