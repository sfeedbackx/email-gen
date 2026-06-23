import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from '@config/config.service';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  const  appConfigService =app.get<AppConfigService>(AppConfigService)
  await app.listen(appConfigService.port ?? 3000);
  app.use(cookieParser());
}
bootstrap();
