import {
  HttpStatus,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from '../auth/dto/createAdmin.dto';
import { AdminSettings } from '@prisma/client';
import { Utils } from 'src/utils/utils';
import { plainToInstance } from 'class-transformer';
import { ResponseAdminSettingsDto } from './dto/admin_settings.dto';
import { Response } from 'express';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { Env } from 'src/config';

@Injectable()
export class AdminService implements OnModuleInit {
  private s3: S3;
  private AWS_S3_BUCKET_NAME = Env.AWS_BUCKET_NAME;
  constructor(
    private prismaService: PrismaService,
    private utils: Utils,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: Env.AWS_ACCESS_KEY,
      secretAccessKey: Env.AWS_SECRET_KEY,
      region: Env.AWS_REGION,
    });
  }

  async onModuleInit() {
    this.ensureDefaultSettings();
  }

  async uploadFile(file) {
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

  async getSettings() {
    return this.prismaService.adminSettings.findFirst();
  }

  async ensureDefaultSettings() {
    try {
      const settings = await this.getSettings();
      if (!settings) {
        await this.prismaService.adminSettings.create({
          data: {
            siteTitle: 'Typing Speed Test',
            metaDescription:
              'Test your typing speed with our online typing test',
          },
        });
      }
    } catch (error) {
      console.error('Error ensuring default settings:', error);
    }
  }

  async createAdmin(data: AdminDto) {
    const { email, password } = data;
    return this.prismaService.admin.create({
      data: {
        email,
        password,
      },
    });
  }

  async findAdminByEmail(email: string) {
    return this.prismaService.admin.findUnique({
      where: {
        email,
      },
    });
  }

  async getAdminSettings(res: Response): Promise<Response> {
    const settings = await this.prismaService.adminSettings.findFirst();
    if (!settings) throw new NotFoundException('Admin settings not found');

    const response = plainToInstance(ResponseAdminSettingsDto, {
      adminSettings: settings,
    });
    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Admin settings retrieved successfully',
      response,
      res,
    );
  }

  async updateAdminSettings(
    data: Partial<AdminSettings>,
    res: Response,
  ): Promise<Response> {
    let settings = await this.getSettings();
    settings = await this.prismaService.adminSettings.update({
      where: {
        id: settings?.id,
      },
      data,
    });
    const response = plainToInstance(ResponseAdminSettingsDto, {
      adminSettings: settings,
    });

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Admin settings updated successfully',
      response,
      res,
    );
  }
}
