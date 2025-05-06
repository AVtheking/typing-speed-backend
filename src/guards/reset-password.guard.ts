import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BaseGuard } from './base.guard';
import { Env } from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ResetPasswordGuard extends BaseGuard {
  constructor(jwtService: JwtService, prismaService: PrismaService) {
    super(jwtService, Env.jwtResetSecret, prismaService);
  }
}
