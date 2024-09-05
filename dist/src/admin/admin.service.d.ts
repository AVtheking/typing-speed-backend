import { OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from '../auth/dto/createAdmin.dto';
import { AdminSettings } from '@prisma/client';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
export declare class AdminService implements OnModuleInit {
    private prismaService;
    private utils;
    private s3;
    private AWS_S3_BUCKET_NAME;
    constructor(prismaService: PrismaService, utils: Utils);
    onModuleInit(): Promise<void>;
    uploadFile(file: any): Promise<S3.ManagedUpload.SendData | undefined>;
    s3_upload(file: any, bucket: any, name: any, mimetype: any): Promise<AWS.S3.ManagedUpload.SendData | undefined>;
    getSettings(): Promise<{
        id: string;
        siteTitle: string;
        metaDescription: string;
        logoImage: string | null;
        defaultLanguage: import(".prisma/client").$Enums.Languages;
        defaultTimeZone: import(".prisma/client").$Enums.TimeZones;
        useSEOFriendlyUrls: boolean;
        discourageSearchEngines: boolean;
        maintainenceMode: boolean;
        maintainenceMessage: string | null;
        euCookieNotification: boolean;
        analyticsTrackingCode: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    ensureDefaultSettings(): Promise<void>;
    createAdmin(data: AdminDto): Promise<{
        id: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAdminByEmail(email: string): Promise<{
        id: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAdminSettings(res: Response): Promise<Response>;
    updateAdminSettings(data: Partial<AdminSettings>, res: Response): Promise<Response>;
}
