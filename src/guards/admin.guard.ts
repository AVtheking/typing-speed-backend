import { JwtService } from '@nestjs/jwt';
import { BaseGuard } from './base.guard';
import { Env } from 'src/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard extends BaseGuard {
  constructor(jwtService: JwtService) {
    super(jwtService, Env.jwtAdminSecret);
  }
}
