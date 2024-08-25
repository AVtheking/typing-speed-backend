import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export declare class BaseGuard implements CanActivate {
    private jwtService;
    private jwtSecret;
    private readonly logger;
    constructor(jwtService: JwtService, jwtSecret: any);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractTokenFromHeader;
    private logRequest;
}
