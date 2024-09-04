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
let UsersService = class UsersService {
    constructor(prisma, utils) {
        this.prisma = prisma;
        this.utils = utils;
    }
    async getUserById(id, res) {
        const user = await this.prisma.user.findUnique({
            where: {
                id,
            },
        });
        const userData = (0, class_transformer_1.plainToInstance)(dto_1.UserDto, {
            ...user,
        });
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
        let user = await this.prisma.user.findUnique({
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
            user = await this.prisma.user.findUnique({
                where: {
                    username,
                },
            });
            if (user) {
                throw new common_1.ConflictException('Username already taken');
            }
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_1.Utils])
], UsersService);
//# sourceMappingURL=users.service.js.map