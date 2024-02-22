import { Module } from '@nestjs/common';
import { Pool } from 'pg';

@Module({
  providers: [
    {
      provide: Pool,
      useValue: new Pool({
        user: 'postgres',
        host: 'postgres-db',
        database: 'db-gif',
        password: 'senhateste',
        port: 5432,
      }),
    },
  ],
  exports: [Pool], // Exporta Pool para que possa ser utilizado em outros módulos
})
export class DatabaseModule {}