import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from 'app.controller';
import { AppService } from 'app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [AppService],
      controllers: [AppController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
