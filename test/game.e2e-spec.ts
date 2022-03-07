import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { GameService } from '../src/modules/game/service';
import { INestApplication } from '@nestjs/common';
import { GameController } from 'modules/game/controller';
import { Game } from 'typeorm/entities';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockGameDTO = {
  id: 1,
  title: 'Mock Game 1',
  publisher: 'Publisher 1',
  releaseDate: null,
  price: 15,
  tags: ['Action', 'Adventure'],
};

const mockPublisherDTO = {
  id: 1,
  name: 'Mock Publisher',
  siret: 1234,
  phone: '+5492235475464',
};

describe('Games', () => {
  let app: INestApplication;
  const gameService = {
    getAll: () => [mockGameDTO],
    getById: () => mockGameDTO,
    create: () => mockGameDTO,
    update: () => mockGameDTO,
    getPublisherByGameId: () => mockPublisherDTO,
    delete: () => [],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: gameService,
        },
      ],
      controllers: [GameController],
    })
      .overrideProvider(GameService)
      .useValue(gameService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET games`, () => {
    return request(app.getHttpServer())
      .get('/game')
      .expect(200)
      .expect(gameService.getAll());
  });

  it(`/GET game by id`, () => {
    return request(app.getHttpServer())
      .get('/game/1')
      .expect(200)
      .expect(gameService.getById());
  });

  it(`/GET publisher by game id`, () => {
    return request(app.getHttpServer())
      .get('/game/1/publisher/')
      .expect(200)
      .expect(gameService.getPublisherByGameId());
  });

  it(`/POST game`, () => {
    return request(app.getHttpServer())
      .post('/game/')
      .expect(201)
      .expect(gameService.create());
  });

  it(`/PUT game`, () => {
    return request(app.getHttpServer())
      .put('/game/1')
      .expect(200)
      .expect(gameService.update());
  });

  it(`/DELETE game`, () => {
    return request(app.getHttpServer()).delete('/game/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
