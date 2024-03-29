import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuração do CORS para permitir solicitações de todas origens
  app.enableCors();

  await app.listen(3000);
}
bootstrap();