"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_1 = require("../utils/utils");
const class_transformer_1 = require("class-transformer");
const admin_settings_dto_1 = require("./dto/admin_settings.dto");
const AWS = require("aws-sdk");
const config_1 = require("../config");
let AdminService = class AdminService {
    constructor(prismaService, utils) {
        this.prismaService = prismaService;
        this.utils = utils;
        this.AWS_S3_BUCKET_NAME = config_1.Env.AWS_BUCKET_NAME;
        this.s3 = new AWS.S3({
            accessKeyId: config_1.Env.AWS_ACCESS_KEY,
            secretAccessKey: config_1.Env.AWS_SECRET_KEY,
            region: config_1.Env.AWS_REGION,
        });
    }
    async onModuleInit() {
        this.ensureDefaultSettings();
    }
    async uploadFile(file) {
        const { originalname } = file;
        return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET_NAME, originalname, file.mimetype);
    }
    async s3_upload(file, bucket, name, mimetype) {
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
        }
        catch (e) {
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
                        metaDescription: 'Test your typing speed with our online typing test',
                    },
                });
            }
        }
        catch (error) {
            console.error('Error ensuring default settings:', error);
        }
    }
    async createAdmin(data) {
        const { email, password } = data;
        return this.prismaService.admin.create({
            data: {
                email,
                password,
            },
        });
    }
    async findAdminByEmail(email) {
        return this.prismaService.admin.findUnique({
            where: {
                email,
            },
        });
    }
    async getAdminSettings(res) {
        const settings = await this.prismaService.adminSettings.findFirst();
        if (!settings)
            throw new common_1.NotFoundException('Admin settings not found');
        const response = (0, class_transformer_1.plainToInstance)(admin_settings_dto_1.ResponseAdminSettingsDto, {
            adminSettings: settings,
        });
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Admin settings retrieved successfully', response, res);
    }
    async updateAdminSettings(data, res) {
        let settings = await this.getSettings();
        settings = await this.prismaService.adminSettings.update({
            where: {
                id: settings?.id,
            },
            data,
        });
        const response = (0, class_transformer_1.plainToInstance)(admin_settings_dto_1.ResponseAdminSettingsDto, {
            adminSettings: settings,
        });
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Admin settings updated successfully', response, res);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_1.Utils])
], AdminService);
//# sourceMappingURL=admin.service.js.map