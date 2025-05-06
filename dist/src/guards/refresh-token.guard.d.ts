import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class RefreshTokenGuard extends BaseGuard {
    constructor(jwtService: JwtService, prismaService: PrismaService);
}
