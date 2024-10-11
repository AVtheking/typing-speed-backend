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
    async signUp(userData, res) {
        return this.authService.signUp(userData, res);
    }
    async verifyEmail(data, res) {
        return this.authService.verifyEmail(data, res);
    }
    async signIn(userData, res) {
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
    async googleTokenExchange(googleTokenExchangeDto, res) {
        return this.authService.tokenExchange(googleTokenExchangeDto, res);
    }
    async adminSignUp(userData, res) {
        return this.authService.signUpAdmin(userData, res);
    }
    async adminSignIn(userData, res) {
        return this.authService.loginAdmin(userData, res);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Sign up a new user',
        description: 'Registers a new user and returns the user details.',
    }),
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
], AuthController.prototype, "signUp", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Verify user email',
        description: 'Verifies the user email by checking the OTP sent to the email.',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.VerifyOtpDto,
        description: 'Email and OTP to verify the email',
    }),
    (0, common_1.Post)('verifyEmail'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'User login',
        description: 'Logs in a user by validating their credentials and returns a JWT token.',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.LoginUserDto,
        description: 'User data to login',
    }),
    (0, common_1.Post)('signIn'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.LoginUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signIn", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Request password reset',
        description: "Sends a password reset OTP to the user's email address.",
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.ForgetPasswordDto,
        description: 'Email to send the OTP for password reset',
    }),
    (0, common_1.Post)('forgetPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ForgetPasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgetPassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Verify OTP for password reset',
        description: 'Verifies the OTP sent for resetting the password.',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.VerifyOtpDto,
        description: 'Email and OTP to verify for password reset',
    }),
    (0, common_1.Post)('verifyOtp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.VerifyOtpDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "verifyOtp", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.ResetPasswordGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Change user password',
        description: 'Allows the user to change their password using the reset token.',
    }),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiBody)({
        type: dto_1.ResetPasswordDto,
        description: "New password to reset the user's password",
    }),
    (0, common_1.Patch)('changePassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.ResetPasswordDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.RefreshTokenGuard),
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh JWT token',
        description: 'Refreshes the JWT token for the authenticated user.',
    }),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Post)('refreshToken'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Exchange Google token',
        description: 'Exchanges Google OAuth token for application authentication.',
    }),
    (0, swagger_1.ApiBody)({
        type: google_exchange_dto_1.GoogleTokenExchangeDto,
        description: 'Google token to exchange for application authentication',
    }),
    (0, common_1.Post)('exchange'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [google_exchange_dto_1.GoogleTokenExchangeDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "googleTokenExchange", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Sign up a new admin',
        description: 'Registers a new admin and returns the admin details.',
    }),
    (0, swagger_1.ApiBody)({
        type: dto_1.CreateUserDto,
        description: 'Admin data to create a new admin',
    }),
    (0, common_1.Post)('admin/signUp'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateUserDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminSignUp", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Admin login',
        description: 'Logs in an admin by validating their credentials and returns a JWT token.',
    }),
    (0, swagger_1.ApiTags)('Admin'),
    (0, swagger_1.ApiBody)({
        type: createAdmin_dto_1.AdminDto,
        description: 'Admin data to login',
    }),
    (0, common_1.Post)('admin/signIn'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createAdmin_dto_1.AdminDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "adminSignIn", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)('Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map