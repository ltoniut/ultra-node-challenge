import { Publisher } from 'typeorm/entities';
import CreatePublisherRequestDto from '../dtos/create.request.dto';
import { GetPublisherResponseDTO } from '../dtos/get.response.dto';

export const mockPublisher: Publisher = {
  id: 1,
  name: 'Mock Publisher',
  siret: 1234,
  phone: '+5492235475464',
  games: [],
};

export const mockPublisherDTO: GetPublisherResponseDTO = {
  id: 1,
  name: 'Mock Publisher',
  siret: 1234,
  phone: '+5492235475464',
};

export const mockPublisherRequestDTO: CreatePublisherRequestDto = {
  name: 'Mock Publisher',
  siret: 1234,
  phone: '+5492235475464',
};
