import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging/logging.interceptor';

import { AuthModule } from './auth/auth.module';

import { OtpModule } from './otp/otp.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { Env } from './config';
import { AdminModule } from './admin/admin.module';
import { PracticeTestModule } from './practice_test/practice_test.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),

    AuthModule,
    OtpModule,
    UsersModule,
    AdminModule,
    MailerModule.forRoot({
      transport: {
        host: Env.SMTP_HOST,

        auth: {
          user: Env.EMAIL,
          pass: Env.EMAIL_PASSWORD,
        },
      },
    }),
    PracticeTestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD, // Apply the ThrottlerGuard globally
      useClass: ThrottlerGuard,
    },
    PrismaService,
  ],
})
export class AppModule {}
