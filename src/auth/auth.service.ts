import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Response } from 'express';

import { generateUsername } from 'unique-username-generator';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';
import { Mailer } from '../utils/Mailer';
import { Utils } from '../utils/utils';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import {
  CreateUserDto,
  ResetPasswordDto,
  ResponseUserDto,
  SignUpResponseDto,
} from './dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleTokenExchangeDto } from './dto/google-exchange.dto';
import { Env } from 'src/config';

import { AdminService } from 'src/admin/admin.service';
import { AdminLoginDto } from './dto/admin-login.dto';
import { AdminDto } from './dto/createAdmin.dto';

interface googleUser {
  username: string;
  email: string;
  id: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private otpService: OtpService,
    private httpService: HttpService,
    private utlis: Utils,
    private mailer: Mailer,
    private adminService: AdminService,
  ) {}

  /*
   * Generates token
   * @param userId
   * @param secret
   * @param expiresIn
   * @returns token
   */
  async generateToken(
    userId: string,
    secret: string | undefined,
    expiresIn: string,
  ): Promise<string> {
    if (!secret) {
      throw new InternalServerErrorException('Secret not found');
    }

    return this.jwtService.sign(
      {
        userId,
      },
      {
        secret,
        expiresIn,
      },
    );
  }

  /*
   * Registers the user
   * @param signUp
   * @param res
   * @returns response
   */
  async signUp(signUp: CreateUserDto, res: Response): Promise<any> {
    const user = await this.usersService.createUser(signUp);

    if (!('email' in user)) {
      return;
    }
    const otp = await this.otpService.generateOtp(signUp.email);

    if (!otp) {
      throw new InternalServerErrorException('Error generating OTP');
    }

    //TODO: Use a queue to send the email

    this.mailer.sendEmailVerificationMail(signUp.email, otp);

    const responseData = plainToInstance(SignUpResponseDto, {
      username: signUp.username,
      email: signUp.email,
    });

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.CREATED,
      'User created successfully',
      responseData,
      res,
    );
  }

  /*
   * Verifies the email
   * @param email
   * @param otp
   * @param res
   * @returns response
   */
  async verifyEmail(data: VerifyOtpDto, res: Response): Promise<Response> {
    const { email, otp } = data;

    const OTP = await this.otpService.getOtp(email);
    if (!OTP) {
      throw new NotFoundException('OTP not found');
    }

    if (!this.otpService.checkExpiration(OTP)) {
      await this.otpService.deleteOtp(email);

      throw new BadRequestException('OTP expired');
    }
    if (OTP.otp != otp) {
      throw new BadRequestException('Invalid OTP');
    }

    //deleting the otp after being used
    await this.otpService.deleteOtp(email);

    //find user by email from usersService
    let user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.verified) {
      throw new BadRequestException('Email already registered');
    }

    //updates the verified field of the user
    user = await this.usersService.updateUserVerificationStatus(user.id);
    const accessToken = await this.generateToken(
      user.id,
      Env.jwtAccessSecret,
      '1h',
    );
    const refreshToken = await this.generateToken(
      user.id,
      Env.jwtRefreshSecret,
      '10d',
    );
    const userData = this.utlis.userResponse(user);
    const responseData = plainToInstance(ResponseUserDto, {
      user: userData,
      accessToken,
      refreshToken,
    });

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'OTP verified',
      responseData,
      res,
    );
  }

  /*
   * Signs in the user
   * @param userData
   * @returns user
   */
  async signIn(userData: LoginUserDto, res: Response): Promise<Response> {
    const user = await this.usersService.loginUser(userData);

    if (!('id' in user)) {
      throw new InternalServerErrorException('Error logging in user');
    }

    const accessToken = await this.generateToken(
      user.id,
      Env.jwtAccessSecret,
      '1h',
    );
    const refreshToken = await this.generateToken(
      user.id,
      Env.jwtRefreshSecret,
      '10d',
    );
    const userResponse = this.utlis.userResponse(user);

    const responseData = plainToInstance(ResponseUserDto, {
      user: userResponse,
      accessToken,
      refreshToken,
    });

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'User logged in',
      responseData,
      res,
    );
  }

  /*
    & Forgets the password
   * @param email
   * @param res
   * @returns response
   */
  async forgetPassword(data: ForgetPasswordDto, res: Response) {
    const email = data.email;

    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }
    //generating the otp and sending it to mail
    const otp = await this.otpService.generateOtp(email);

    //TODO: use a queue to send the email
    this.mailer.sendForgetPasswordMail(email, otp);

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'OTP sent to your email',
      null,
      res,
    );
  }

  /*
   * Verifies the OTP
   * @param otpData
   * @param res
   * @returns response
   */
  async verfiyOtp(otpData: VerifyOtpDto, res: Response) {
    const { email, otp } = otpData;
    const OTP = await this.otpService.getOtp(email);

    if (!OTP) {
      throw new BadRequestException('OTP not found');
    }
    //checking if the token is expired or not
    if (!this.otpService.checkExpiration(OTP)) {
      this.otpService.deleteOtp(email);

      throw new BadRequestException('OTP expired');
    }

    //checking if the otp is valid or not
    if (OTP.otp != otp) {
      throw new BadRequestException('Invalid OTP');
    }

    //deleting the otp after it is verified
    //delete otp asyncronously
    this.otpService.deleteOtp(email);
    const user = await this.usersService.getUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verified) {
      throw new UnauthorizedException('User with this email does not exist');
    }

    //generating the token to reset password
    const token = await this.generateToken(user.id, Env.jwtResetSecret, '1h');

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'OTP verified',
      { resetPasswordToken: token },
      res,
    );
  }

  /*
   * Changes the password
   * @param password
   * @param res
   * @param userId
   * @returns response
   */
  async changePassword(
    password: ResetPasswordDto,
    res: Response,
    userId: string,
  ): Promise<Response> {
    if (!password) {
      throw new BadRequestException('Password is required');
    }

    await this.usersService.updateUserPassword(userId, password.password);

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Password changed successfully',
      null,
      res,
    );
  }

  /*
   * Refreshes the access token of the user
   * @param refreshToken
   * @returns user
   */

  async refreshToken(res: Response, userId: string): Promise<Response> {
    if (!Env.jwtAccessSecret) {
      throw new InternalServerErrorException('Access secret not defined');
    }
    const accessToken = await this.generateToken(
      userId,
      Env.jwtAccessSecret,
      '10d',
    );

    const responseData = plainToInstance(ResponseUserDto, {
      accessToken,
    });

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Token refreshed',
      responseData,
      res,
    );
  }

  /*
   * Exchanges the token
   * @param access_token
   * @param res
   * @returns user
   */
  async tokenExchange(
    googleTokenExchangeDto: GoogleTokenExchangeDto,
    res: Response,
  ) {
    const { access_token } = googleTokenExchangeDto;
    const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`;

    ///TODO: Add more error handling here
    const response = await this.httpService.axiosRef.get(url);

    const data = response.data;

    if (response.status === 200) {
      const randomNumber = this.utlis.randomInteger(1000, 9999);
      const user = {
        username: `${data.given_name.toLowerCase()}.${data.family_name.toLowerCase()}${randomNumber}`,
        email: data.email,
        id: data.sub,
      };

      return this.googleSignIn(user, res);
    }
  }

  /*
   * Signs in the user using google
   * @param user
   * @param res
   * @returns response
   */
  async googleSignIn(user: googleUser, res: Response) {
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const userExists = await this.usersService.getUserByEmail(user.email);
    const password = this.utlis.randomPassword();
    if (!userExists) {
      return this.registerOauthUser(
        {
          email: user.email,
          username: user.username,
          password: password,
        },
        res,
      );
    }

    const accessToken = await this.generateToken(
      userExists.id,
      Env.jwtAccessSecret,
      '10d',
    );
    const refreshToken = await this.generateToken(
      userExists.id,
      Env.jwtRefreshSecret,
      '10d',
    );

    //exposing only necessary fields to the user
    //exluding password field from the response
    const userData = this.utlis.userResponse(userExists);
    const responseData = plainToInstance(ResponseUserDto, {
      user: userData,
      accessToken,
      refreshToken,
    });
    console.log('\x1b[32m', 'User logged in using google \x1b[1m');
    return await this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'User logged in',
      responseData,
      res,
    );
  }

  /*
   * Registers the user
   * @param userData
   * @param res
   * @returns response
   */

  async registerOauthUser(userData: CreateUserDto, res: Response) {
    const newUser = await this.usersService.createUser(userData);
    const user = newUser as User;

    user.username = generateUsername(userData.username);
    user.verified = true;

    await this.usersService.updateUser(user.id, {
      username: user.username,
      verified: user.verified,
    });

    const accessToken = await this.generateToken(
      user.id,
      Env.jwtAccessSecret,
      '1h',
    );
    const refreshToken = await this.generateToken(
      user.id,
      Env.jwtRefreshSecret,
      '10d',
    );
    const userResponse = this.utlis.userResponse(user);
    const responseData = plainToInstance(ResponseUserDto, {
      user: { userResponse },
      accessToken,
      refreshToken,
    });

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.CREATED,
      'User created successfully',
      responseData,
      res,
    );
  }

  async signUpAdmin(data: AdminDto, res: Response) {
    const { email, password } = data;
    const hashPassword = await this.utlis.hashPassword(password);
    const admin = await this.adminService.createAdmin({
      email,
      password: hashPassword,
    });

    if (!admin) {
      throw new InternalServerErrorException('Error creating admin');
    }
    const response = plainToInstance(SignUpResponseDto, {
      email: data.email,
    });

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.CREATED,
      'Admin created successfully',
      response,
      res,
    );
  }

  async loginAdmin(data: AdminDto, res: Response) {
    const { email, password } = data;
    const admin = await this.adminService.findAdminByEmail(email);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    const isPasswordMatch = await this.utlis.comparePassword(
      password,
      admin.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    if (!Env.jwtAdminSecret) {
      throw new InternalServerErrorException('Access secret is not defined');
    }

    const adminAccessToken = await this.generateToken(
      admin.id,
      Env.jwtAdminSecret,
      '1h',
    );

    // const refreshToken = await this.generateToken(
    //   admin.id,
    //   Env.jwtRefreshSecret,
    //   '10d',
    // );

    const adminUserResponse = this.utlis.adminResponse(admin);
    const responseData = plainToInstance(AdminLoginDto, {
      adminUser: adminUserResponse,
      accessToken: adminAccessToken,
    });

    return this.utlis.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Admin logged in',
      responseData,
      res,
    );
  }
}
