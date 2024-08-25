import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
export declare class ResetPasswordGuard extends BaseGuard {
    constructor(jwtService: JwtService);
}
