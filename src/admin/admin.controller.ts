import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Put,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  AdminSettingDto,
  ResponseAdminSettingsDto,
} from './dto/admin_settings.dto';
import { Response } from 'express';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { cleanData } from 'src/boolean';
import { AdminGuard } from 'src/guards';
import fs from 'fs';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('settings')
  async getAdminSettings(@Res() res: Response) {
    return this.adminService.getAdminSettings(res);
  }

  @Put('settings')
  @UseInterceptors(FileInterceptor('logoImage'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        siteTitle: { type: 'string', description: 'The title of the site' },
        metaDescription: {
          type: 'string',
          description: 'The meta description of the site',
        },
        logoImage: {
          type: 'string',
          format: 'binary',
          description: 'The URL of the logo image',
        },
        defaultLanguage: {
          type: 'string',
          enum: ['English', 'Spanish', 'French', 'Hindi'],
          description: 'The default language of the site',
        },

        defaultTimeZone: {
          type: 'string',
          enum: ['IST', 'EST', 'CST', 'PST', 'UTC'],
          description: 'The default timezone of the site',
        },
        useSEOFriendlyUrls: {
          type: 'boolean',
          description: 'Whether to use SEO-friendly URLs',
        },
        discourageSearchEngines: {
          type: 'boolean',
          description:
            'Whether to discourage search engines from indexing the site',
        },
        maintainenceMode: {
          type: 'boolean',
          description: 'Whether the site is in maintenance mode',
        },
        maintainenceMessage: {
          type: 'string',
          description: 'The maintenance mode message',
        },
        euCookieNotification: {
          type: 'boolean',
          description: 'Whether to show an EU cookie notification',
        },
        analyticsTrackingCode: {
          type: 'string',
          description: 'The analytics tracking code',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    type: ResponseAdminSettingsDto,
    description: 'Update and return the new admin settings',
  })
  async updateAdminSettings(
    @Body() data: AdminSettingDto,
    @Res() res: Response,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: new RegExp('^image/(jpeg|jpg|png)$'),
        })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    const cleanedData = cleanData<AdminSettingDto>(data);
    const currentSetting = await this.adminService.getSettings();

    if (file) {
      const s3Response = await this.adminService.uploadFile(file);
      console.log('s3Response', s3Response);
      cleanedData.logoImage = s3Response?.Location ?? undefined;
    } else {
      cleanedData.logoImage = currentSetting?.logoImage ?? undefined;
    }

    return this.adminService.updateAdminSettings(cleanedData, res);
  }
}
