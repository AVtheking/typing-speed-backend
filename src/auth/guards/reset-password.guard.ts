import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BaseGuard } from './base.guard';
import { Env } from 'src/config';

@Injectable()
export class ResetPasswordGuard extends BaseGuard {
  constructor(jwtService: JwtService) {
    super(jwtService, Env.jwtResetSecret);
  }
}
