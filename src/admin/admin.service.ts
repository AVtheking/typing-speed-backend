import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from '../auth/dto/createAdmin.dto';
import { AdminSettings } from '@prisma/client';
import { Utils } from 'src/utils/utils';
import { plainToInstance } from 'class-transformer';
import { ResponseAdminSettingsDto } from './dto/admin_settings.dto';
import { Response } from 'express';

@Injectable()
export class AdminService implements OnModuleInit {
  constructor(
    private prismaService: PrismaService,
    private utils: Utils,
  ) {}

  async onModuleInit() {
    this.ensureDefaultSettings();
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
    if (!settings)
      throw new InternalServerErrorException('Admin settings not found');

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
