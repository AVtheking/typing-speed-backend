import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';
import { Mailer } from '../utils/Mailer';
import { Utils } from '../utils/utils';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { CreateUserDto, ResetPasswordDto } from './dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { GoogleTokenExchangeDto } from './dto/google-exchange.dto';
import { AdminService } from 'src/admin/admin.service';
import { AdminDto } from './dto/createAdmin.dto';
interface googleUser {
    username: string;
    email: string;
    id: string;
}
export declare class AuthService {
    private usersService;
    private jwtService;
    private otpService;
    private httpService;
    private utlis;
    private mailer;
    private adminService;
    constructor(usersService: UsersService, jwtService: JwtService, otpService: OtpService, httpService: HttpService, utlis: Utils, mailer: Mailer, adminService: AdminService);
    generateToken(userId: string, secret: string | undefined, expiresIn: string): Promise<string>;
    signUp(signUp: CreateUserDto, res: Response): Promise<any>;
    verifyEmail(data: VerifyOtpDto, res: Response): Promise<Response>;
    signIn(userData: LoginUserDto, res: Response): Promise<Response>;
    forgetPassword(data: ForgetPasswordDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verfiyOtp(otpData: VerifyOtpDto, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(password: ResetPasswordDto, res: Response, userId: string): Promise<Response>;
    refreshToken(res: Response, userId: string): Promise<Response>;
    tokenExchange(googleTokenExchangeDto: GoogleTokenExchangeDto, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    googleSignIn(user: googleUser, res: Response): Promise<Response<any, Record<string, any>>>;
    registerOauthUser(userData: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    signUpAdmin(data: AdminDto, res: Response): Promise<Response<any, Record<string, any>>>;
    loginAdmin(data: AdminDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
export {};
