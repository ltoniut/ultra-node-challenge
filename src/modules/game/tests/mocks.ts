import { Game, Publisher } from 'typeorm/entities';
import { GetGameResponseDTO } from '../dtos/get.response.dto';
import UpdateGameRequestDto from '../dtos/update.request.dto';

export const mockPublisher: Publisher = {
  id: 1,
  name: 'Mock Publisher',
  siret: 1234,
  phone: '+5492235475464',
  games: [],
};

export const mockGames: Game[] = [
  {
    id: 1,
    title: 'Mock Game 1',
    publisher: 1,
    releaseDate: null,
    price: 15,
    tags: 'Action||Adventure',
    publisherEntity: mockPublisher,
  },
  {
    id: 2,
    title: 'Mock Game 2',
    publisher: 1,
    releaseDate: null,
    price: 20,
    tags: 'Action||Adventure||Horror',
    publisherEntity: mockPublisher,
  },
  {
    id: 3,
    title: 'Mock Game 3',
    publisher: 1,
    releaseDate: new Date(2021, 2),
    price: 20,
    tags: 'Action||Adventure||Horror',
    publisherEntity: mockPublisher,
  },
  {
    id: 4,
    title: 'Mock Game 4',
    publisher: 1,
    releaseDate: new Date(2020, 2),
    price: 20,
    tags: 'Action||Adventure||Horror',
    publisherEntity: mockPublisher,
  },
];

export const mockGameDTOs: GetGameResponseDTO[] = [
  {
    id: 1,
    title: 'Mock Game 1',
    publisher: mockPublisher.name,
    releaseDate: null,
    price: 15,
    tags: ['Action', 'Adventure'],
  },
  {
    id: 2,
    title: 'Mock Game 2',
    publisher: mockPublisher.name,
    releaseDate: null,
    price: 20,
    tags: ['Action', 'Adventure', 'Horror'],
  },
  {
    id: 3,
    title: 'Mock Game 3',
    publisher: mockPublisher.name,
    releaseDate: new Date(2021, 2),
    price: 20,
    tags: ['Action', 'Adventure', 'Horror'],
  },
  {
    id: 4,
    title: 'Mock Game 4',
    publisher: mockPublisher.name,
    releaseDate: new Date(2020, 2),
    price: 20,
    tags: ['Action', 'Adventure', 'Horror'],
  },
];

export const mockGameRequestDTO: UpdateGameRequestDto = {
  title: 'Mock Game 1',
  publisherId: 1,
  releaseDate: null,
  price: 15,
  tags: ['Action', 'Adventure'],
};
