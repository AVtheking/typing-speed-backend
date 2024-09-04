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
exports.OtpService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OtpService = class OtpService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOtp(email) {
        return this.prisma.otp.findUnique({
            where: {
                email,
            },
        });
    }
    async deleteOtp(email) {
        this.prisma.otp.delete({
            where: {
                email,
            },
        });
    }
    checkExpiration(otp) {
        const currentTime = new Date();
        const otpTime = otp?.createdAt;
        const diff = currentTime.getTime() - otpTime.getTime();
        return diff < 60000;
    }
    async generateOtp(email) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const existingOtp = await this.prisma.otp.findFirst({
            where: {
                email,
            },
        });
        if (existingOtp) {
            await this.prisma.otp.update({
                where: {
                    id: existingOtp.id,
                },
                data: {
                    otp,
                },
            });
        }
        else {
            await this.prisma.otp.create({
                data: {
                    email,
                    otp,
                },
            });
        }
        return otp;
    }
};
exports.OtpService = OtpService;
exports.OtpService = OtpService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OtpService);
//# sourceMappingURL=otp.service.js.map