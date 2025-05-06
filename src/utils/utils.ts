import { Injectable } from '@nestjs/common';
import { Admin, Months, User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import * as AWS from 'aws-sdk';
import {
  charsDigits,
  charsLowercase,
  charsSpecial,
  charsUppercase,
} from '../auth/constants';
import { UserDto } from '../auth/dto/response-user.dto';
import { AdminUserDto } from 'src/auth/dto/admin-login.dto';
import { S3 } from 'aws-sdk';
import { Env } from 'src/config';
import { Mode as PrismaMode } from '@prisma/client';
import { Mode as DtoMode } from '../users/dto/save-test-result.dto';

export enum ScoreScope {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}
const MILLISECONDS_IN_DAY = 86400000;
const MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * 7;
@Injectable()
export class Utils {
  private s3: S3;
  private AWS_S3_BUCKET_NAME = Env.AWS_BUCKET_NAME;
  constructor() {
    this.s3 = new AWS.S3({
      accessKeyId: Env.AWS_ACCESS_KEY,
      secretAccessKey: Env.AWS_SECRET_KEY,
      region: Env.AWS_REGION,
    });
  }

  async uploadFile(file) {
    console.log(file);
    const { originalname } = file;

    return await this.s3_upload(
      file.buffer,
      this.AWS_S3_BUCKET_NAME,
      originalname,
      file.mimetype,
    );
  }

  async s3_upload(
    file,
    bucket,
    name,
    mimetype,
  ): Promise<AWS.S3.ManagedUpload.SendData | undefined> {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };
    try {
      const s3Response = await this.s3.upload(params).promise();
      return s3Response;
    } catch (e) {
      console.log(e);
    }
  }

  async sendHttpResponse(
    success: boolean,
    statusCode: number,
    message: string,
    data: any,
    res: Response,
  ) {
    return res.status(statusCode).json({
      success,
      message,
      data: {
        ...data,
      },
    });
  }

  randomPassword() {
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += charsLowercase.charAt(
        Math.floor(Math.random() * charsLowercase.length),
      );
      password += charsUppercase.charAt(
        Math.floor(Math.random() * charsUppercase.length),
      );
      password += charsSpecial.charAt(
        Math.floor(Math.random() * charsSpecial.length),
      );
      password += charsDigits.charAt(
        Math.floor(Math.random() * charsDigits.length),
      );
    }

    return password;
  }

  randomInteger(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  userResponse(user: User): UserDto {
    const userResponse = plainToInstance(UserDto, {
      ...user,
    });
    return userResponse;
  }
  adminResponse(admin: Admin): AdminUserDto {
    const adminResponse = plainToInstance(AdminUserDto, {
      ...admin,
    });
    return adminResponse;
  }

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    try {
      return bcrypt.compare(password, hashPassword);
    } catch (error) {
      console.error('Error comparing password:', error);
      return false;
    }
  }

  calculateScore(
    wpm: number,
    acc: number,
    timestamp: number,
    scope: ScoreScope,
  ) {
    const normalizedWpm = Math.floor(wpm * 100);
    const normalizedAcc = Math.floor(acc * 100);

    const padAmount = 100000;
    const firstPart = (padAmount + normalizedWpm) * padAmount;
    const secondPart = (firstPart + normalizedAcc) * padAmount;

    // Determine the remaining time in the selected scope
    let remainingTimeInScope;
    const date = new Date(timestamp);

    if (scope === ScoreScope.DAY) {
      const currentDayTimeMilliseconds =
        timestamp - (timestamp % MILLISECONDS_IN_DAY);
      const todayMilliseconds = timestamp - currentDayTimeMilliseconds;

      remainingTimeInScope = MILLISECONDS_IN_DAY - todayMilliseconds;
    } else if (scope === ScoreScope.WEEK) {
      const startOfWeek =
        timestamp -
        (date.getDay() * MILLISECONDS_IN_DAY +
          date.getHours() * 3600000 +
          date.getMinutes() * 60000 +
          date.getSeconds() * 1000);

      const elapsedMillisecondsInWeek = timestamp - startOfWeek;
      remainingTimeInScope = MILLISECONDS_IN_WEEK - elapsedMillisecondsInWeek;
    } else if (scope === ScoreScope.MONTH) {
      const startOfMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1,
      ).getTime();
      const nextMonth = new Date(
        date.getFullYear(),
        date.getMonth() + 1,
        1,
      ).getTime();
      const millisecondsInMonth = nextMonth - startOfMonth;
      const elapsedMillisecondsInMonth = timestamp - startOfMonth;
      remainingTimeInScope = millisecondsInMonth - elapsedMillisecondsInMonth;
    }

    // Calculate the final score
    return secondPart + Math.floor(remainingTimeInScope / 1000);
  }

  getWeekKey(date: Date): string {
    const year = date.getFullYear();
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear =
      (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    const weekNumber = Math.ceil(
      (pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7,
    );
    return `${year}-W${weekNumber}`;
  }

  mapDtoModeToPrismaMode(mode: DtoMode): PrismaMode {
    switch (mode) {
      case DtoMode.FifteenSeconds:
        return PrismaMode.FifteenSeconds;
      case DtoMode.ThirtySeconds:
        return PrismaMode.ThirtySeconds;
      case DtoMode.SixtySeconds:
        return PrismaMode.SixtySeconds;
      default:
        throw new Error(`Invalid mode value: ${mode}`);
    }
  }

  getStartAndEndOfWeek(
    year: number,
    week: number,
  ): { startDate: Date; endDate: Date } {
    const firstDayOfYear = new Date(year, 0, 1);
    const dayOffset = (firstDayOfYear.getDay() + 6) % 7;

    const firstThursday = new Date(
      firstDayOfYear.getTime() + (3 - dayOffset) * MILLISECONDS_IN_DAY,
    );

    const startDate = new Date(
      firstThursday.getTime() + (week - 1) * 7 * MILLISECONDS_IN_DAY,
    );

    const endDate = new Date(startDate.getTime() + 6 * MILLISECONDS_IN_DAY);

    return { startDate, endDate };
  }

  monthFromMonthNumber(month: number): Months {
    switch (month) {
      case 1:
        return 'January';
      case 2:
        return 'February';
      case 3:
        return 'March';
      case 4:
        return 'April';
      case 5:
        return 'May';
      case 6:
        return 'June';
      case 7:
        return 'July';
      case 8:
        return 'August';
      case 9:
        return 'September';
      case 10:
        return 'October';
      case 11:
        return 'November';
      case 12:
        return 'December';
      default:
        throw new Error(`Invalid month number: ${month}`);
    }
  }
}
