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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const platform_express_1 = require("@nestjs/platform-express");
const admin_settings_dto_1 = require("./dto/admin_settings.dto");
const swagger_1 = require("@nestjs/swagger");
const boolean_1 = require("../boolean");
const guards_1 = require("../guards");
let AdminController = class AdminController {
    constructor(adminService) {
        this.adminService = adminService;
    }
    async getAdminSettings(res) {
        return this.adminService.getAdminSettings(res);
    }
    async updateAdminSettings(data, res, file) {
        const cleanedData = (0, boolean_1.cleanData)(data);
        const currentSetting = await this.adminService.getSettings();
        if (file) {
            const s3Response = await this.adminService.uploadFile(file);
            console.log('s3Response', s3Response);
            cleanedData.logoImage = s3Response?.Location ?? undefined;
        }
        else {
            cleanedData.logoImage = currentSetting?.logoImage ?? undefined;
        }
        return this.adminService.updateAdminSettings(cleanedData, res);
    }
    async getLogoImage() {
        return 'hello';
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('settings'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAdminSettings", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)('settings'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('logoImage')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiBody)({
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
                    description: 'Whether to discourage search engines from indexing the site',
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        type: admin_settings_dto_1.ResponseAdminSettingsDto,
        description: 'Update and return the new admin settings',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: new RegExp('^image/(jpeg|jpg|png)$'),
    })
        .addMaxSizeValidator({ maxSize: 1024 * 1024 })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [admin_settings_dto_1.AdminSettingDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateAdminSettings", null);
__decorate([
    (0, common_1.Get)('settings/logo'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getLogoImage", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map