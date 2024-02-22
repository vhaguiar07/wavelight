import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppService } from '../services/app.service';

import { AppController } from '../controllers/app.controller';
import { UserController } from '../controllers/user.controller';
import { AuthController } from '../controllers/auth.controller';
import { RegistrationController } from '../controllers/registration.controller';
import { GifController } from '../controllers/gif.controller';
import { VideoController } from '../controllers/video.controller';
import { UserService } from '../user/user.service';

import { DatabaseModule } from '../database/database.module';
import { DATABASE_CONNECTION } from '../database/database.constants';
import { Pool } from 'pg';

@Module({
  imports: [DatabaseModule, ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', '..', 'uploads'), // Configurando a rota de gifs para os usuários acessarem
    serveRoot: '/gifs',
    serveStaticOptions: { index: false },
  })],
  controllers: [AppController, UserController, AuthController, RegistrationController, GifController, VideoController],
  providers: [UserService, AppService, {
    provide: DATABASE_CONNECTION,
    useExisting: Pool,
  }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
  }
}