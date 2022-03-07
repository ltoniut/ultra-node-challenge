import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { PublisherService } from '../src/modules/publisher/service';
import { INestApplication } from '@nestjs/common';
import { Publisher } from 'typeorm/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PublisherController } from 'modules/publisher/controller';

const mockPublisherDTO = {
  id: 1,
  name: 'Mock Publisher',
  siret: 1234,
  phone: '+5492235475464',
};

describe('Pubisher', () => {
  let app: INestApplication;
  const publisherService = {
    getAll: () => [mockPublisherDTO],
    getById: () => mockPublisherDTO,
    create: () => mockPublisherDTO,
    update: () => mockPublisherDTO,
    delete: () => [],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        PublisherService,
        {
          provide: getRepositoryToken(Publisher),
          useValue: publisherService,
        },
      ],
      controllers: [PublisherController],
    })
      .overrideProvider(PublisherService)
      .useValue(publisherService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET publisher`, () => {
    return request(app.getHttpServer())
      .get('/publisher')
      .expect(200)
      .expect(publisherService.getAll());
  });

  it(`/GET publisher by id`, () => {
    return request(app.getHttpServer())
      .get('/publisher/1')
      .expect(200)
      .expect(publisherService.getById());
  });

  it(`/POST publisher`, () => {
    return request(app.getHttpServer())
      .post('/publisher/')
      .expect(201)
      .expect(publisherService.create());
  });

  it(`/PUT publisher`, () => {
    return request(app.getHttpServer())
      .put('/publisher/1')
      .expect(200)
      .expect(publisherService.update());
  });

  it(`/DELETE publisher`, () => {
    return request(app.getHttpServer()).delete('/publisher/1').expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
