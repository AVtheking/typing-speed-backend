import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
export declare class RefreshTokenGuard extends BaseGuard {
    constructor(jwtService: JwtService);
}
