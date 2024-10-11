import { Injectable } from '@nestjs/common';
import { Admin, User } from '@prisma/client';
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
}
