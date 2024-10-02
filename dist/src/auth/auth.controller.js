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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const dto_1 = require("./dto");
const guards_1 = require("../guards");
const swagger_1 = require("@nestjs/swagger");
const google_exchange_dto_1 = require("./dto/google-exchange.dto");
const createAdmin_dto_1 = require("./dto/createAdmin.dto");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async SignUp(userData, res) {
        return this.authService.signUp(userData, res);
    }
    async verifyEmail(data, res) {
        return this.authService.verifyEmail(data, res);
    }
    async SignIn(userData, res) {
        return this.authService.signIn(userData, res);
    }
    async forgetPassword(data, res) {
        return this.authService.forgetPassword(data, res);
    }
    async verifyOtp(otpData, res) {
        return this.authService.verfiyOtp(otpData, res);
    }
    async changePassword(resetData, res, req) {
        return this.authService.changePassword(resetData, res, req.user);
    }
    async refreshToken(req, res) {
        const userId = req.user;
        return this.authService.refreshToken(res, userId);
    }
    async googeleTokenExchange(googleTokenExchangeDto, res) {
        return this.authService.tokenExchange(googleTokenExchangeDto, res);
    }
    async signUp(userData, res) {
        return this.authService.signUpAdmin(userData, res);
    }
    async signIn(userData, res) {
        return this.authService.loginAdmin(userData, res);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateUserDto,
        description: 'User data to create a new user',
    }),
    (0, common_1.Post)('signUp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SignUp", null);
__decorate([
    (0, common_1.Post)('verifyEmail'),
    (0, swagger_1.ApiBody)({
        type: dto_1.VerifyOtpDto,
        description: 'Email and OTP to verify the email',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('signIn'),
    (0, swagger_1.ApiBody)({
        type: dto_1.LoginUserDto,
        description: 'User data to login',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "SignIn", null);
__decorate([
    (0, common_1.Post)('forgetPassword'),
    (0, swagger_1.ApiBody)({
        type: dto_1.ForgetPasswordDto,
        description: 'Email to send the OTP',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ForgetPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, common_1.Post)('verifyOtp'),
    (0, swagger_1.ApiBody)({
        type: dto_1.VerifyOtpDto,
        description: 'Email and OTP to verify the email',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.ResetPasswordGuard),
    (0, common_1.Patch)('changePassword'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiBody)({
        type: dto_1.ResetPasswordDto,
        description: 'New password to change the password',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ResetPasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RefreshTokenGuard),
    (0, common_1.Post)('refreshToken'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('exchange'),
    (0, swagger_1.ApiBody)({
        type: google_exchange_dto_1.GoogleTokenExchangeDto,
        description: 'New password to change the password',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_exchange_dto_1.GoogleTokenExchangeDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googeleTokenExchange", null);
__decorate([
    (0, common_1.Post)('admin/signUp'),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateUserDto,
        description: 'Admin data to create a new admin',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signUp", null);
__decorate([
    (0, common_1.Post)('admin/signIn'),
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBody)({
        type: createAdmin_dto_1.AdminDto,
        description: 'Admin data to login',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createAdmin_dto_1.AdminDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map