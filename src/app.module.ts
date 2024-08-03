import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './logging/logging.interceptor';

import { AuthModule } from './auth/auth.module';

import { OtpModule } from './otp/otp.module';
import { PrismaService } from './prisma/prisma.service';
import { UsersModule } from './users/users.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { Env } from './config';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    PrismaService,
  ],
})
export class AppModule {}
