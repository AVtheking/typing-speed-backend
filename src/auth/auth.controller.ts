import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  VerifyOtpDto,
  LoginUserDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto';
import { Response } from 'express';
import { RefreshTokenGuard, ResetPasswordGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signUp')
  async SignUp(@Body() userData: CreateUserDto, @Res() res: Response) {
    return await this.authService.signUp(userData, res);
  }
  @Post('verifyEmail')
  async verifyEmail(@Body() data: VerifyOtpDto, @Res() res: Response) {
    return await this.authService.verifyEmail(data, res);
  }

  @Post('signIn')
  async SignIn(@Body() userData: LoginUserDto, @Res() res: Response) {
    return await this.authService.signIn(userData, res);
  }

  @Post('forgetPassword')
  async forgetPassword(@Body() data: ForgetPasswordDto, @Res() res: Response) {
    return await this.authService.forgetPassword(data, res);
  }
  @Post('verifyOtp')
  async verifyOtp(@Body() otpData: VerifyOtpDto, @Res() res: Response) {
    return await this.authService.verfiyOtp(otpData, res);
  }

  @UseGuards(ResetPasswordGuard)
  @Post('changePassword')
  async changePassword(
    @Body() resetData: ResetPasswordDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    return await this.authService.changePassword(resetData, res, req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refreshToken')
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const userId = req.user;
    return await this.authService.refreshToken(res, userId);
  }

  @Post('exchange')
  async googeleTokenExchange(
    @Body('access_token') access_token: string,
    @Res() res,
  ) {
    return await this.authService.tokenExchange(access_token, res);
  }
}
