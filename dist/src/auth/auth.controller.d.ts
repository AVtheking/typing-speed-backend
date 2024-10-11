import { AuthService } from './auth.service';
import { CreateUserDto, VerifyOtpDto, LoginUserDto, ForgetPasswordDto, ResetPasswordDto } from './dto';
import { Response } from 'express';
import { GoogleTokenExchangeDto } from './dto/google-exchange.dto';
import { AdminDto } from './dto/createAdmin.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signUp(userData: CreateUserDto, res: Response): Promise<any>;
    verifyEmail(data: VerifyOtpDto, res: Response): Promise<Response<any, Record<string, any>>>;
    signIn(userData: LoginUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    forgetPassword(data: ForgetPasswordDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyOtp(otpData: VerifyOtpDto, res: Response): Promise<Response<any, Record<string, any>>>;
    changePassword(resetData: ResetPasswordDto, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    refreshToken(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    googleTokenExchange(googleTokenExchangeDto: GoogleTokenExchangeDto, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    adminSignUp(userData: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    adminSignIn(userData: AdminDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
