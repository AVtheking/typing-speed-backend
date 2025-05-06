import { Otp } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class OtpService {
    private prisma;
    constructor(prisma: PrismaService);
    getOtp(email: string): Promise<Otp | null>;
    deleteOtp(email: string): Promise<{
        id: string;
        email: string;
        otp: number;
        createdAt: Date;
    }>;
    checkExpiration(otp: Otp): boolean;
    generateOtp(email: string): Promise<number>;
}
