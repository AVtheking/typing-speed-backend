import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
import { Env } from 'src/config';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminGuard extends BaseGuard {
  constructor(jwtService: JwtService, prismaService: PrismaService) {
    super(jwtService, Env.jwtAdminSecret, prismaService);
  }
}
