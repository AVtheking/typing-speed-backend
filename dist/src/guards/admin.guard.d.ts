import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
export declare class AdminGuard extends BaseGuard {
    constructor(jwtService: JwtService);
}
