import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static files from the "uploads" directory
  // Serve static files from the "uploads" directory
  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads/',
  // });

  app.enableCors({
    origin: [
      'https://world-job-seven.vercel.app', // Main Frontend
      'https://admin.world-job.market',     // Decoupled Admin (Custom Domain)
      'https://world-job-admin-portal.vercel.app', // Decoupled Admin (Vercel Default)
      'http://localhost:5173',              // Local Dev
      'http://localhost:3000',
      'https://world-job-market.vercel.app',
      /\.vercel\.app$/                      // Allow all Vercel previews
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3001);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
