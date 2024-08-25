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
exports.ResponseAdminSettingsDto = exports.AdminSettingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const boolean_1 = require("../../boolean");
var Languages;
(function (Languages) {
    Languages["ENGLISH"] = "English";
    Languages["SPANISH"] = "Spanish";
    Languages["FRENCH"] = "French";
    Languages["HINDI"] = "Hindi";
})(Languages || (Languages = {}));
var TimeZones;
(function (TimeZones) {
    TimeZones["IST"] = "IST";
    TimeZones["EST"] = "EST";
    TimeZones["CST"] = "CST";
    TimeZones["PST"] = "PST";
    TimeZones["UTC"] = "UTC";
})(TimeZones || (TimeZones = {}));
class AdminSettingDto {
}
exports.AdminSettingDto = AdminSettingDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The title of the site' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminSettingDto.prototype, "siteTitle", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The meta description of the site' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminSettingDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The URL of the logo image' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminSettingDto.prototype, "logoImage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: Languages,
        description: 'The default language of the site',
    }),
    (0, class_validator_1.IsEnum)(Languages),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminSettingDto.prototype, "defaultLanguage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: TimeZones,
        description: 'The default timezone of the site',
    }),
    (0, class_validator_1.IsEnum)(TimeZones),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminSettingDto.prototype, "defaultTimeZone", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Whether to use SEO-friendly URLs' }),
    (0, class_validator_1.IsOptional)(),
    (0, boolean_1.ToBoolean)(),
    __metadata("design:type", Boolean)
], AdminSettingDto.prototype, "useSEOFriendlyUrls", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to discourage search engines from indexing the site',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, boolean_1.ToBoolean)(),
    __metadata("design:type", Boolean)
], AdminSettingDto.prototype, "discourageSearchEngines", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether the site is in maintenance mode',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, boolean_1.ToBoolean)(),
    __metadata("design:type", Boolean)
], AdminSettingDto.prototype, "maintainenceMode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The maintenance mode message' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AdminSettingDto.prototype, "maintainenceMessage", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Whether to show an EU cookie notification',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, boolean_1.ToBoolean)(),
    __metadata("design:type", Boolean)
], AdminSettingDto.prototype, "euCookieNotification", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'The analytics tracking code' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AdminSettingDto.prototype, "analyticsTrackingCode", void 0);
class ResponseAdminSettingsDto {
}
exports.ResponseAdminSettingsDto = ResponseAdminSettingsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: AdminSettingDto, description: 'The admin settings' }),
    __metadata("design:type", AdminSettingDto)
], ResponseAdminSettingsDto.prototype, "setting", void 0);
//# sourceMappingURL=admin_settings.dto.js.map