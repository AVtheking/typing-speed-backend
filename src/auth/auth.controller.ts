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
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { GoogleTokenExchangeDto } from './dto/google-exchange.dto';
import { AdminDto } from './dto/createAdmin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({
    type: CreateUserDto,
    description: 'User data to create a new user',
  })
  @Post('signUp')
  async SignUp(@Body() userData: CreateUserDto, @Res() res: Response) {
    return await this.authService.signUp(userData, res);
  }
  @Post('verifyEmail')
  @ApiBody({
    type: VerifyOtpDto,
    description: 'Email and OTP to verify the email',
  })
  async verifyEmail(@Body() data: VerifyOtpDto, @Res() res: Response) {
    return await this.authService.verifyEmail(data, res);
  }

  @Post('signIn')
  @ApiBody({
    type: LoginUserDto,
    description: 'User data to login',
  })
  async SignIn(@Body() userData: LoginUserDto, @Res() res: Response) {
    return await this.authService.signIn(userData, res);
  }

  @Post('forgetPassword')
  @ApiBody({
    type: ForgetPasswordDto,
    description: 'Email to send the OTP',
  })
  async forgetPassword(@Body() data: ForgetPasswordDto, @Res() res: Response) {
    return await this.authService.forgetPassword(data, res);
  }
  @Post('verifyOtp')
  @ApiBody({
    type: VerifyOtpDto,
    description: 'Email and OTP to verify the email',
  })
  async verifyOtp(@Body() otpData: VerifyOtpDto, @Res() res: Response) {
    return await this.authService.verfiyOtp(otpData, res);
  }

  @UseGuards(ResetPasswordGuard)
  @Post('changePassword')
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: ResetPasswordDto,
    description: 'New password to change the password',
  })
  async changePassword(
    @Body() resetData: ResetPasswordDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    return await this.authService.changePassword(resetData, res, req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refreshToken')
  @ApiBearerAuth('JWT')
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const userId = req.user;
    return await this.authService.refreshToken(res, userId);
  }

  @Post('exchange')
  @ApiBody({
    type: GoogleTokenExchangeDto,
    description: 'New password to change the password',
  })
  async googeleTokenExchange(
    @Body() googleTokenExchangeDto: GoogleTokenExchangeDto,
    @Res() res: Response,
  ) {
    return await this.authService.tokenExchange(googleTokenExchangeDto, res);
  }

  @Post('admin/signUp')
  @ApiBody({
    type: CreateUserDto,
    description: 'Admin data to create a new admin',
  })
  async signUp(@Body() userData: CreateUserDto, @Res() res: Response) {
    return await this.authService.signUpAdmin(userData, res);
  }

  @Post('admin/signIn')
  @ApiBody({
    type: AdminDto,
    description: 'Admin data to login',
  })
  async signIn(@Body() userData: AdminDto, @Res() res: Response) {
    return await this.authService.loginAdmin(userData, res);
  }
}
