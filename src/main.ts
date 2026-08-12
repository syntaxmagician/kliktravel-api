import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  const origins = (config.get<string>('CORS_ORIGINS') || '*')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins.includes('*') ? true : origins,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useStaticAssets(join(process.cwd(), config.get('UPLOAD_DIR', 'uploads')), {
    prefix: '/uploads/',
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('KlikTravel API')
    .setDescription(
      [
        'Backend API KlikTravel — selaras dengan frontend kliktravel-1.',
        '',
        '**Public storefront**',
        '- Destinations (region + sub) → `GET /destinations?locale=id|en`',
        '- Curated journeys → `GET /journeys?locale=id|en`',
        '- Open trips / tour packages → `GET /open-trips?locale=id|en`',
        '- Journal → `GET /journal`',
        '- Testimonials → `GET /testimonials`',
        '- Private trip inquiry → `POST /private-trip-requests`',
        '',
        '**Admin CMS** (`/admin/*`, Bearer JWT, role ADMIN)',
        '- destinations, journeys, open-trips, journal, testimonials, private-trips, settings, media',
      ].join('\n'),
    )
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth')
    .addTag('Destinations')
    .addTag('Journeys')
    .addTag('Open Trips')
    .addTag('Journal')
    .addTag('Testimonials')
    .addTag('Private Trip Requests')
    .addTag('Media')
    .addTag('Settings')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = Number(config.get('PORT', 3000));
  await app.listen(port);
  console.log(`KlikTravel API running on http://localhost:${port}`);
  console.log(`Swagger docs: http://localhost:${port}/docs`);
}
bootstrap();
