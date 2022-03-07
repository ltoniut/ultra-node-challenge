import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { PublisherModule } from '../src/modules/publisher/module';
import { PublisherService } from '../src/modules/publisher/service';
import { INestApplication } from '@nestjs/common';

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
    save: () => mockPublisherDTO,
    update: () => mockPublisherDTO,
    delete: () => [],
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PublisherModule],
    })
      .overrideProvider(PublisherService)
      .useValue(publisherService)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET publisher`, () => {
    return request(app.getHttpServer()).get('/publisher').expect(200).expect({
      data: publisherService.getAll(),
    });
  });

  it(`/GET publisher by id`, () => {
    return request(app.getHttpServer()).get('/publisher/1').expect(200).expect({
      data: publisherService.getById(),
    });
  });

  it(`/POST publisher`, () => {
    return request(app.getHttpServer()).post('/publisher/').expect(200).expect({
      data: publisherService.save(),
    });
  });

  it(`/PUT publisher`, () => {
    return request(app.getHttpServer()).post('/publisher/').expect(200).expect({
      data: publisherService.update(),
    });
  });

  it(`/DELETE publisher`, () => {
    return request(app.getHttpServer()).post('/delete/').expect(200).expect({
      data: publisherService.delete(),
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
