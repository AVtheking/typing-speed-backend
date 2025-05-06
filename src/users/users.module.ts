import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
// import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { Utils } from 'src/utils/utils';
import { JwtModule } from '@nestjs/jwt';
import { OtpService } from 'src/otp/otp.service';
import { Mailer } from 'src/utils/Mailer';

@Module({
  imports: [JwtModule.register({})],
  controllers: [UserController],
  providers: [
    UsersService,
    PrismaService,
    AppService,
    Utils,
    OtpService,
    Mailer,
  ],
  exports: [UsersService],
})
export class UsersModule {}
