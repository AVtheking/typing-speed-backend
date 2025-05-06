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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const guards_1 = require("../guards");
const change_email_dto_1 = require("./dto/change-email.dto");
const save_test_result_dto_1 = require("./dto/save-test-result.dto");
const platform_express_1 = require("@nestjs/platform-express");
const verify_otp_dto_1 = require("./dto/verify-otp.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getUser(req, res) {
        const userId = req.user;
        return this.userService.getUserById(userId, res);
    }
    async changeEmail(req, res, body) {
        const userId = req.user;
        const { email } = body;
        return this.userService.changeEmail(userId, email, res);
    }
    async changePassword(req, res, body) {
        const userId = req.user;
        const { password } = body;
        return this.userService.changePassword(userId, password, res);
    }
    async verifyEmail(req, res, body) {
        const userId = req.user;
        return this.userService.verifyEmail(body, userId, res);
    }
    async saveTest(req, res, body) {
        const userId = req.user;
        return this.userService.saveTestResult(userId, body, res);
    }
    async updateProfileImage(req, res, file) {
        const userId = req.user;
        if (file) {
            return this.userService.uploadProfileImage(file, userId, res);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Get user details',
        description: 'Retrieve user details by user ID from the JWT token.',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    (0, common_1.Patch)('/change-email'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change user email',
        description: 'Allows a user to change their email address.',
    }),
    (0, swagger_1.ApiBody)({ type: change_email_dto_1.ChangeEmailDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, change_email_dto_1.ChangeEmailDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeEmail", null);
__decorate([
    (0, common_1.Patch)('/change-password'),
    (0, swagger_1.ApiOperation)({
        summary: 'Change user password',
        description: 'Allows a user to change their password.',
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.Post)('/verify-email'),
    (0, swagger_1.ApiOperation)({
        summary: 'Verify email address',
        description: 'Verifies the OTP for email and updates the email verification status.',
    }),
    (0, swagger_1.ApiBody)({ type: verify_otp_dto_1.VerifyOtpDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, verify_otp_dto_1.VerifyOtpDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.Post)('/test'),
    (0, swagger_1.ApiOperation)({
        summary: 'Save test result',
        description: 'Saves the test result for the logged-in user.',
    }),
    (0, swagger_1.ApiBody)({ type: save_test_result_dto_1.SaveTestResultDto }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, save_test_result_dto_1.SaveTestResultDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "saveTest", null);
__decorate([
    (0, common_1.Patch)('/profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('profileImage')),
    (0, swagger_1.ApiOperation)({
        summary: 'Update profile image',
        description: 'Updates the profile image for the logged-in user. Only JPEG, JPG, and PNG formats are allowed, with a maximum size of 2MB.',
    }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                profileImage: {
                    type: 'string',
                    format: 'binary',
                    description: 'Uploaded profile image',
                },
            },
        },
    }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({
        fileType: new RegExp('^image/(jpeg|jpg|png)$'),
    })
        .addMaxSizeValidator({ maxSize: 2 * 1024 * 1024 })
        .build({
        errorHttpStatusCode: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
        fileIsRequired: false,
    }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfileImage", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    (0, swagger_1.ApiTags)('User'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UserController);
//# sourceMappingURL=users.controller.js.map