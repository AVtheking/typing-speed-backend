import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
export declare class AuthGuard extends BaseGuard {
    constructor(jwtService: JwtService);
}
