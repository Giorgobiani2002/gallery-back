import { NestFactory } from '@nestjs/core';
import { createAppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const AppModule = await createAppModule();
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3005);
}
bootstrap();
