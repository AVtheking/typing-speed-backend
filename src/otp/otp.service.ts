import { Injectable } from '@nestjs/common';
import { Otp } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OtpService {
  constructor(private prisma: PrismaService) {}

  async getOtp(email: string): Promise<Otp | null> {
    return this.prisma.otp.findUnique({
      where: {
        email,
      },
    });
  }
  async deleteOtp(email: string) {
    this.prisma.otp.delete({
      where: {
        email,
      },
    });
  }
  //checks if the otp is expired or not
  checkExpiration(otp: Otp): boolean {
    const currentTime = new Date();

    const otpTime = otp?.createdAt;

    const diff = currentTime.getTime() - otpTime.getTime();
    //if the difference is less than 1 minute then return true
    return diff < 60000;
  }

  async generateOtp(email: string): Promise<number> {
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
    } else {
      await this.prisma.otp.create({
        data: {
          email,
          otp,
        },
      });
    }

    return otp;
  }
}
