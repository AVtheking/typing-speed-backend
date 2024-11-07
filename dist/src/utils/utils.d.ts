import { Admin, Months, User } from '@prisma/client';
import { Response } from 'express';
import * as AWS from 'aws-sdk';
import { UserDto } from '../auth/dto/response-user.dto';
import { AdminUserDto } from 'src/auth/dto/admin-login.dto';
import { S3 } from 'aws-sdk';
import { Mode as PrismaMode } from '@prisma/client';
import { Mode as DtoMode } from '../users/dto/save-test-result.dto';
export declare enum ScoreScope {
    DAY = "day",
    WEEK = "week",
    MONTH = "month"
}
export declare class Utils {
    private s3;
    private AWS_S3_BUCKET_NAME;
    constructor();
    uploadFile(file: any): Promise<S3.ManagedUpload.SendData | undefined>;
    s3_upload(file: any, bucket: any, name: any, mimetype: any): Promise<AWS.S3.ManagedUpload.SendData | undefined>;
    sendHttpResponse(success: boolean, statusCode: number, message: string, data: any, res: Response): Promise<Response<any, Record<string, any>>>;
    randomPassword(): string;
    randomInteger(min: number, max: number): number;
    userResponse(user: User): UserDto;
    adminResponse(admin: Admin): AdminUserDto;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashPassword: string): Promise<boolean>;
    calculateScore(wpm: number, acc: number, timestamp: number, scope: ScoreScope): number;
    getWeekKey(date: Date): string;
    mapDtoModeToPrismaMode(mode: DtoMode): PrismaMode;
    getStartAndEndOfWeek(year: number, week: number): {
        startDate: Date;
        endDate: Date;
    };
    monthFromMonthNumber(month: number): Months;
}
