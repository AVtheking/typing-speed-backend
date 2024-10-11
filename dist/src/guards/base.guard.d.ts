import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class BaseGuard implements CanActivate {
    private jwtService;
    private jwtSecret;
    private prismaService;
    private readonly logger;
    constructor(jwtService: JwtService, jwtSecret: any, prismaService: PrismaService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
    private logRequest;
}
