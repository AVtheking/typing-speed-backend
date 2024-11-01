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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const dto_1 = require("../auth/dto");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_1 = require("../utils/utils");
const otp_service_1 = require("../otp/otp.service");
const Mailer_1 = require("../utils/Mailer");
const redis_module_1 = require("../redis/redis.module");
const ioredis_1 = require("ioredis");
let UsersService = class UsersService {
    constructor(redisClient, prisma, otpService, utils, mailer) {
        this.redisClient = redisClient;
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
        const { wpm, accuracy, mode, raw, correct, incorrect, extras, missed } = saveTestResultDto;
        const timestamp = Date.now();
        if (!['15s', '30s', '60s'].includes(mode)) {
            throw new common_1.BadRequestException('Invalid mode. Allowed values are "15s", "30s", or "60s".');
        }
        const dailyScore = this.utils.calculateScore(wpm, accuracy, timestamp, utils_1.ScoreScope.DAY);
        const weeklyScore = this.utils.calculateScore(wpm, accuracy, timestamp, utils_1.ScoreScope.WEEK);
        const monthlyScore = this.utils.calculateScore(wpm, accuracy, timestamp, utils_1.ScoreScope.MONTH);
        const dayKey = `leaderboard:daily:${mode}:${new Date().toISOString().split('T')[0]}`;
        const weekKey = `leaderboard:weekly:${mode}:${this.utils.getWeekKey(new Date())}`;
        const monthKey = `leaderboard:monthly:${mode}:${new Date().getFullYear()}-${new Date().getMonth() + 1}`;
        await Promise.all([
            this.redisClient.zadd(dayKey, dailyScore, userId),
            this.redisClient.zadd(weekKey, weeklyScore, userId),
            this.redisClient.zadd(monthKey, monthlyScore, userId),
        ]);
        console.log('dayKey', dayKey);
        await Promise.all([
            this.redisClient.hset(`${dayKey}:${userId}`, {
                wpm: wpm.toString(),
                raw: raw.toString(),
                accuracy: accuracy.toString(),
                correct: correct.toString(),
                incorrect: incorrect.toString(),
                extras: extras.toString(),
                missed: missed.toString(),
            }),
            this.redisClient.hset(`${weekKey}:${userId}`, {
                wpm: wpm.toString(),
                raw: raw.toString(),
                accuracy: accuracy.toString(),
                correct: correct.toString(),
                incorrect: incorrect.toString(),
                extras: extras.toString(),
                missed: missed.toString(),
            }),
            this.redisClient.hset(`${monthKey}:${userId}`, {
                wpm: wpm.toString(),
                raw: raw.toString(),
                accuracy: accuracy.toString(),
                correct: correct.toString(),
                incorrect: incorrect.toString(),
                extras: extras.toString(),
                missed: missed.toString(),
            }),
        ]);
        const dailyRank = await this.redisClient.zrevrank(dayKey, userId);
        const weeklyRank = await this.redisClient.zrevrank(weekKey, userId);
        const monthlyRank = await this.redisClient.zrevrank(monthKey, userId);
        const adjustedDailyRank = dailyRank !== null ? dailyRank + 1 : null;
        const adjustedWeeklyRank = weeklyRank !== null ? weeklyRank + 1 : null;
        const adjustedMonthlyRank = monthlyRank !== null ? monthlyRank + 1 : null;
        const result = await this.prisma.userTestResult.create({
            data: {
                wpm,
                accuracy,
                mode: this.utils.mapDtoModeToPrismaMode(mode),
                raw,
                correct,
                incorrect,
                extras,
                missed,
                userId,
            },
        });
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Test result saved successfully', {
            result,
            dailyRank: adjustedDailyRank,
            weeklyRank: adjustedWeeklyRank,
            monthlyRank: adjustedMonthlyRank,
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
    __param(0, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT_TOKEN)),
    __metadata("design:paramtypes", [ioredis_1.default,
        prisma_service_1.PrismaService,
        otp_service_1.OtpService,
        utils_1.Utils,
        Mailer_1.Mailer])
], UsersService);
//# sourceMappingURL=users.service.js.map