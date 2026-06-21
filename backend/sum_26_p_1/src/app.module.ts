import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '@modules/auth/guards/permissions.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { PermissionsModule } from '@modules/permissions/permissions.module';
import { RolesModule } from '@modules/roles/roles.module';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TransformInterceptor } from './interceptors/transform';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoggingInterceptor } from './interceptors/logging';
import { ContactsModule } from './modules/contacts/contacts.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ThreadsModule } from './modules/threads/threads.module';
import { MessagesModule } from './modules/messages/messages.module';
import { DraftsModule } from './modules/drafts/drafts.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    DatabaseModule,
    AppConfigModule,
    AuthModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
    ContactsModule,
    DocumentsModule,
    ThreadsModule,
    MessagesModule,
    DraftsModule,
    AiModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ZodValidationPipe(),
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useValue: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useValue: RolesGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new LoggingInterceptor(),
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new TransformInterceptor(),
    },

    AppService,

  ],
})
export class AppModule { }
