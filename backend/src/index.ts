import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cors from 'cors';
import express from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(cors());
  app.use(express.json());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 3000);
  console.log(`Aplicação rodando em: ${await app.getUrl()}`);
}
bootstrap();