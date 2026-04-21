import { DrizzleModule } from '@blog-builder/db';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error(
    'DATABASE_URL is required. Copy .env.example to .env and fill in the Supabase connection string.',
  );
}

@Module({
  imports: [
    DrizzleModule.forRoot({
      url: databaseUrl,
      max: Number(process.env['DATABASE_POOL_MAX'] ?? 10),
    }),
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
