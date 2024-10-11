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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../auth/dto");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_1 = require("../utils/utils");
const otp_service_1 = require("../otp/otp.service");
const Mailer_1 = require("../utils/Mailer");
let UsersService = class UsersService {
    constructor(prisma, otpService, utils, mailer) {
        this.prisma = prisma;
        this.otpService = otpService;
        this.utils = utils;
        this.mailer = mailer;
    }
    async getUserById(id, res) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
            include: {
                UserTestResult: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const userData = (0, class_transformer_1.plainToInstance)(dto_1.UserDto, {
            ...user,
        });
        if (!res) {
            return user;
        }
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'User found', { user: userData }, res);
    }
    async createUser(data) {
        const { username, email, password } = data;
        const existingUsername = await this.prisma.user.findUnique({
            where: {
                username,
            },
        });
        if (existingUsername && existingUsername.email != email) {
            throw new common_1.ConflictException('Username already taken');
        }
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (user) {
            if (!user.verified) {
                return this.updateUser(user.id, { username, email });
            }
            else {
                throw new common_1.ConflictException('Email already registered');
            }
        }
        else {
            const hashedPassword = await this.utils.hashPassword(password);
            return this.prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                },
            });
        }
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                ...data,
            },
        });
    }
    async updateUserVerificationStatus(id) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                verified: true,
            },
        });
    }
    async updateUserPassword(id, password) {
        const hashedPassword = await this.utils.hashPassword(password);
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                password: hashedPassword,
            },
        });
    }
    async updateUserEmail(id, email) {
        return this.prisma.user.update({
            where: {
                id,
            },
            data: {
                email,
            },
        });
    }
    async loginUser(userData) {
        const { email, password } = userData;
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.verified) {
            throw new common_1.UnauthorizedException('Email not verified');
        }
        const isPasswordValid = await this.utils.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        return user;
    }
    async getUserByEmail(email) {
        if (!email)
            throw new common_1.BadRequestException('Email is required');
        return this.prisma.user.findUnique({
            where: {
                email,
            },
        });
    }
    async changeEmail(id, email, res) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.verified) {
            throw new common_1.UnauthorizedException('Email not verified');
        }
        const existingUser = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already registered');
        }
        const otp = await this.otpService.generateOtp(email);
        if (!otp) {
            throw new common_1.InternalServerErrorException('Error generating OTP');
        }
        this.mailer.sendEmailVerificationMail(email, otp);
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Otp sent to email', {}, res);
    }
    async verifyEmail(data, userId, res) {
        const { email, otp } = data;
        const OTP = await this.otpService.getOtp(email);
        if (!OTP) {
            throw new common_1.NotFoundException('OTP not found');
        }
        if (!this.otpService.checkExpiration(OTP)) {
            await this.otpService.deleteOtp(email);
            throw new common_1.BadRequestException('OTP expired');
        }
        if (OTP.otp != otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        await this.otpService.deleteOtp(email);
        const updatedUser = await this.updateUserEmail(userId, email);
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Email verified successfully', {
            user: updatedUser,
        }, res);
    }
    async saveTestResult(userId, saveTestResultDto, res) {
        const user = await this.getUserById(userId, null);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { wpm, accuracy, time, raw, correct, incorrect, extras, missed } = saveTestResultDto;
        await this.prisma.userTestResult.create({
            data: {
                wpm,
                accuracy,
                time,
                raw,
                correct,
                incorrect,
                extras,
                missed,
                userId,
            },
        });
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Test result saved successfully', {
            wpm,
            accuracy,
            time,
            raw,
            correct,
            incorrect,
            extras,
            missed,
        }, res);
    }
    async uploadProfileImage(file, userId, res) {
        const response = await this.utils.uploadFile(file);
        const user = await this.prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                profileImage: response?.Location ?? '',
            },
        });
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Profile image uploaded successfully', {
            ...user,
        }, res);
    }
    async changePassword(userId, newPassword, res) {
        const updatedUser = await this.updateUserPassword(userId, newPassword);
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Password changed successfully', {
            user: updatedUser,
        }, res);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        otp_service_1.OtpService,
        utils_1.Utils,
        Mailer_1.Mailer])
], UsersService);
//# sourceMappingURL=users.service.js.map