import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { GameModule } from '../src/modules/game/module';
import { GameService } from '../src/modules/game/service';
import { INestApplication } from '@nestjs/common';

const mockGameDTO = {
  id: 1,
  title: 'Mock Game 1',
  publisher: 'Publisher 1',
  releaseDate: null,
  price: 15,
  tags: ['Action', 'Adventure'],
};

describe('Games', () => {
  let app: INestApplication;
  const gameService = {
    getAll: () => [mockGameDTO],
    getById: () => mockGameDTO,
    save: () => mockGameDTO,
    update: () => mockGameDTO,
    delete: () => [],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GameModule],
    })
      .overrideProvider(GameService)
      .useValue(gameService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET games`, () => {
    return request(app.getHttpServer()).get('/game').expect(200).expect({
      data: gameService.getAll(),
    });
  });

  it(`/GET game by id`, () => {
    return request(app.getHttpServer()).get('/game/1').expect(200).expect({
      data: gameService.getById(),
    });
  });

  it(`/POST game`, () => {
    return request(app.getHttpServer()).post('/game/').expect(200).expect({
      data: gameService.save(),
    });
  });

  it(`/PUT game`, () => {
    return request(app.getHttpServer()).post('/game/').expect(200).expect({
      data: gameService.update(),
    });
  });

  it(`/DELETE game`, () => {
    return request(app.getHttpServer()).post('/delete/').expect(200).expect({
      data: gameService.update(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
