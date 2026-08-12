import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('KlikTravel API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  it('/destinations (GET) is public', () => {
    return request(app.getHttpServer()).get('/destinations').expect((res) => {
      // 200 when DB up, 500 if DB unreachable — route itself must not 401
      expect(res.status).not.toBe(401);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
