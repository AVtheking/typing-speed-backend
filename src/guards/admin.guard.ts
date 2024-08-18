import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
import { Env } from 'src/config';

export class AdminGuard extends BaseGuard {
  constructor(jwtService: JwtService) {
    super(jwtService, Env.jwtAdminSecret);
  }
}
