import { Admin, User } from '@prisma/client';
import { Response } from 'express';
import * as AWS from 'aws-sdk';
import { UserDto } from '../auth/dto/response-user.dto';
import { AdminUserDto } from 'src/auth/dto/admin-login.dto';
import { S3 } from 'aws-sdk';
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
}
