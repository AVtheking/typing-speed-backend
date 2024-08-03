import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminDto } from '../auth/dto/createAdmin.dto';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async createAdmin(data: AdminDto) {
    const { email, password } = data;
    return this.prismaService.admin.create({
      data: {
        email,
        password,
      },
    });
  }

  async findAdminByEmail(email: string) {
    return this.prismaService.admin.findUnique({
      where: {
        email,
      },
    });
  }
}
