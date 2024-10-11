import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateUserDto,
  VerifyOtpDto,
  LoginUserDto,
  ForgetPasswordDto,
  ResetPasswordDto,
} from './dto';
import { Response } from 'express';
import { RefreshTokenGuard, ResetPasswordGuard } from '../guards';
import { ApiBearerAuth, ApiBody, ApiTags, ApiOperation } from '@nestjs/swagger';
import { GoogleTokenExchangeDto } from './dto/google-exchange.dto';
import { AdminDto } from './dto/createAdmin.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Sign up a new user',
    description: 'Registers a new user and returns the user details.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'User data to create a new user',
  })
  @Post('signUp')
  async signUp(@Body() userData: CreateUserDto, @Res() res: Response) {
    return this.authService.signUp(userData, res);
  }

  @ApiOperation({
    summary: 'Verify user email',
    description:
      'Verifies the user email by checking the OTP sent to the email.',
  })
  @ApiBody({
    type: VerifyOtpDto,
    description: 'Email and OTP to verify the email',
  })
  @Post('verifyEmail')
  async verifyEmail(@Body() data: VerifyOtpDto, @Res() res: Response) {
    return this.authService.verifyEmail(data, res);
  }

  @ApiOperation({
    summary: 'User login',
    description:
      'Logs in a user by validating their credentials and returns a JWT token.',
  })
  @ApiBody({
    type: LoginUserDto,
    description: 'User data to login',
  })
  @Post('signIn')
  async signIn(@Body() userData: LoginUserDto, @Res() res: Response) {
    return this.authService.signIn(userData, res);
  }

  @ApiOperation({
    summary: 'Request password reset',
    description: "Sends a password reset OTP to the user's email address.",
  })
  @ApiBody({
    type: ForgetPasswordDto,
    description: 'Email to send the OTP for password reset',
  })
  @Post('forgetPassword')
  async forgetPassword(@Body() data: ForgetPasswordDto, @Res() res: Response) {
    return this.authService.forgetPassword(data, res);
  }

  @ApiOperation({
    summary: 'Verify OTP for password reset',
    description: 'Verifies the OTP sent for resetting the password.',
  })
  @ApiBody({
    type: VerifyOtpDto,
    description: 'Email and OTP to verify for password reset',
  })
  @Post('verifyOtp')
  async verifyOtp(@Body() otpData: VerifyOtpDto, @Res() res: Response) {
    return this.authService.verfiyOtp(otpData, res);
  }

  @UseGuards(ResetPasswordGuard)
  @ApiOperation({
    summary: 'Change user password',
    description:
      'Allows the user to change their password using the reset token.',
  })
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: ResetPasswordDto,
    description: "New password to reset the user's password",
  })
  @Patch('changePassword')
  async changePassword(
    @Body() resetData: ResetPasswordDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    return this.authService.changePassword(resetData, res, req.user);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Refresh JWT token',
    description: 'Refreshes the JWT token for the authenticated user.',
  })
  @ApiBearerAuth('JWT')
  @Post('refreshToken')
  async refreshToken(@Req() req: any, @Res() res: Response) {
    const userId = req.user;
    return this.authService.refreshToken(res, userId);
  }

  @ApiOperation({
    summary: 'Exchange Google token',
    description: 'Exchanges Google OAuth token for application authentication.',
  })
  @ApiBody({
    type: GoogleTokenExchangeDto,
    description: 'Google token to exchange for application authentication',
  })
  @Post('exchange')
  async googleTokenExchange(
    @Body() googleTokenExchangeDto: GoogleTokenExchangeDto,
    @Res() res: Response,
  ) {
    return this.authService.tokenExchange(googleTokenExchangeDto, res);
  }

  @ApiOperation({
    summary: 'Sign up a new admin',
    description: 'Registers a new admin and returns the admin details.',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Admin data to create a new admin',
  })
  @Post('admin/signUp')
  async adminSignUp(@Body() userData: CreateUserDto, @Res() res: Response) {
    return this.authService.signUpAdmin(userData, res);
  }

  @ApiOperation({
    summary: 'Admin login',
    description:
      'Logs in an admin by validating their credentials and returns a JWT token.',
  })
  @ApiTags('Admin')
  @ApiBody({
    type: AdminDto,
    description: 'Admin data to login',
  })
  @Post('admin/signIn')
  async adminSignIn(@Body() userData: AdminDto, @Res() res: Response) {
    return this.authService.loginAdmin(userData, res);
  }
}
