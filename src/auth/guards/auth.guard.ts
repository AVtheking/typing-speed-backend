import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BaseGuard } from './base.guard';
import { Env } from 'src/config';

@Injectable()
export class AuthGuard extends BaseGuard {
  constructor(jwtService: JwtService) {
    super(jwtService, Env.jwtAccessSecret);
  }
}
