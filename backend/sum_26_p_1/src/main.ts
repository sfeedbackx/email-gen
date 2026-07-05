import { AppConfigService } from '@config/config.service';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });
  const appConfigService = app.get<AppConfigService>(AppConfigService);
  await app.listen(appConfigService.port ?? 3000);
  app.use(cookieParser());
}
bootstrap();
