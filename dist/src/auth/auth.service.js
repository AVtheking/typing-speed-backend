"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const class_transformer_1 = require("class-transformer");
const unique_username_generator_1 = require("unique-username-generator");
const otp_service_1 = require("../otp/otp.service");
const users_service_1 = require("../users/users.service");
const Mailer_1 = require("../utils/Mailer");
const utils_1 = require("../utils/utils");
const dto_1 = require("./dto");
const config_1 = require("../config");
const admin_service_1 = require("../admin/admin.service");
const admin_login_dto_1 = require("./dto/admin-login.dto");
let AuthService = class AuthService {
    constructor(usersService, jwtService, otpService, httpService, utlis, mailer, adminService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.otpService = otpService;
        this.httpService = httpService;
        this.utlis = utlis;
        this.mailer = mailer;
        this.adminService = adminService;
    }
    async generateToken(userId, secret, expiresIn) {
        if (!secret) {
            throw new common_1.InternalServerErrorException('Secret not found');
        }
        return this.jwtService.sign({
            userId,
        }, {
            secret,
            expiresIn,
        });
    }
    async signUp(signUp, res) {
        const user = await this.usersService.createUser(signUp);
        if (!('email' in user)) {
            return;
        }
        const otp = await this.otpService.generateOtp(signUp.email);
        if (!otp) {
            throw new common_1.InternalServerErrorException('Error generating OTP');
        }
        this.mailer.sendEmailVerificationMail(signUp.email, otp);
        const responseData = (0, class_transformer_1.plainToInstance)(dto_1.SignUpResponseDto, {
            username: signUp.username,
            email: signUp.email,
        });
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.CREATED, 'User created successfully', responseData, res);
    }
    async verifyEmail(data, res) {
        const { email, otp } = data;
        const OTP = await this.otpService.getOtp(email);
        if (!OTP) {
            throw new common_1.NotFoundException('OTP not found');
        }
        if (!this.otpService.checkExpiration(OTP)) {
            await this.otpService.deleteOtp(email);
            throw new common_1.BadRequestException('OTP expired');
        }
        if (OTP.otp != otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        await this.otpService.deleteOtp(email);
        let user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.verified) {
            throw new common_1.BadRequestException('Email already registered');
        }
        user = await this.usersService.updateUserVerificationStatus(user.id);
        const accessToken = await this.generateToken(user.id, config_1.Env.jwtAccessSecret, '1h');
        const refreshToken = await this.generateToken(user.id, config_1.Env.jwtRefreshSecret, '10d');
        const userData = this.utlis.userResponse(user);
        const responseData = (0, class_transformer_1.plainToInstance)(dto_1.ResponseUserDto, {
            user: userData,
            accessToken,
            refreshToken,
        });
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'OTP verified', responseData, res);
    }
    async signIn(userData, res) {
        const user = await this.usersService.loginUser(userData);
        if (!('id' in user)) {
            throw new common_1.InternalServerErrorException('Error logging in user');
        }
        const accessToken = await this.generateToken(user.id, config_1.Env.jwtAccessSecret, '1h');
        const refreshToken = await this.generateToken(user.id, config_1.Env.jwtRefreshSecret, '10d');
        const userResponse = this.utlis.userResponse(user);
        const responseData = (0, class_transformer_1.plainToInstance)(dto_1.ResponseUserDto, {
            user: userResponse,
            accessToken,
            refreshToken,
        });
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'User logged in', responseData, res);
    }
    async forgetPassword(data, res) {
        const email = data.email;
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.verified) {
            throw new common_1.UnauthorizedException('Email not verified');
        }
        const otp = await this.otpService.generateOtp(email);
        this.mailer.sendForgetPasswordMail(email, otp);
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'OTP sent to your email', null, res);
    }
    async verfiyOtp(otpData, res) {
        const { email, otp } = otpData;
        const OTP = await this.otpService.getOtp(email);
        if (!OTP) {
            throw new common_1.BadRequestException('OTP not found');
        }
        if (!this.otpService.checkExpiration(OTP)) {
            this.otpService.deleteOtp(email);
            throw new common_1.BadRequestException('OTP expired');
        }
        if (OTP.otp != otp) {
            throw new common_1.BadRequestException('Invalid OTP');
        }
        this.otpService.deleteOtp(email);
        const user = await this.usersService.getUserByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.verified) {
            throw new common_1.UnauthorizedException('User with this email does not exist');
        }
        const token = await this.generateToken(user.id, config_1.Env.jwtResetSecret, '1h');
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'OTP verified', { resetPasswordToken: token }, res);
    }
    async changePassword(password, res, userId) {
        if (!password) {
            throw new common_1.BadRequestException('Password is required');
        }
        await this.usersService.updateUserPassword(userId, password.password);
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'Password changed successfully', null, res);
    }
    async refreshToken(res, userId) {
        const accessToken = await this.generateToken(userId, config_1.Env.jwtAccessSecret, '10d');
        const responseData = (0, class_transformer_1.plainToInstance)(dto_1.ResponseUserDto, {
            accessToken,
        });
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'Token refreshed', responseData, res);
    }
    async tokenExchange(googleTokenExchangeDto, res) {
        const { access_token } = googleTokenExchangeDto;
        const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`;
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
    async googleSignIn(user, res) {
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const userExists = await this.usersService.getUserByEmail(user.email);
        const password = this.utlis.randomPassword();
        if (!userExists) {
            return this.registerOauthUser({
                email: user.email,
                username: user.username,
                password: password,
            }, res);
        }
        const accessToken = await this.generateToken(userExists.id, config_1.Env.jwtAccessSecret, '10d');
        const refreshToken = await this.generateToken(userExists.id, config_1.Env.jwtRefreshSecret, '10d');
        const userData = this.utlis.userResponse(userExists);
        const responseData = (0, class_transformer_1.plainToInstance)(dto_1.ResponseUserDto, {
            user: userData,
            accessToken,
            refreshToken,
        });
        console.log('\x1b[32m', 'User logged in using google \x1b[1m');
        return await this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'User logged in', responseData, res);
    }
    async registerOauthUser(userData, res) {
        const newUser = await this.usersService.createUser(userData);
        const user = newUser;
        user.username = (0, unique_username_generator_1.generateUsername)(userData.username);
        user.verified = true;
        await this.usersService.updateUser(user.id, {
            username: user.username,
            verified: user.verified,
        });
        const accessToken = await this.generateToken(user.id, config_1.Env.jwtAccessSecret, '1h');
        const refreshToken = await this.generateToken(user.id, config_1.Env.jwtRefreshSecret, '10d');
        const userResponse = this.utlis.userResponse(user);
        const responseData = (0, class_transformer_1.plainToInstance)(dto_1.ResponseUserDto, {
            user: { userResponse },
            accessToken,
            refreshToken,
        });
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.CREATED, 'User created successfully', responseData, res);
    }
    async signUpAdmin(data, res) {
        const { email, password } = data;
        const hashPassword = await this.utlis.hashPassword(password);
        const admin = await this.adminService.createAdmin({
            email,
            password: hashPassword,
        });
        if (!admin) {
            throw new common_1.InternalServerErrorException('Error creating admin');
        }
        const response = (0, class_transformer_1.plainToInstance)(dto_1.SignUpResponseDto, {
            email: data.email,
        });
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.CREATED, 'Admin created successfully', response, res);
    }
    async loginAdmin(data, res) {
        const { email, password } = data;
        const admin = await this.adminService.findAdminByEmail(email);
        if (!admin) {
            throw new common_1.NotFoundException('Admin not found');
        }
        const isPasswordMatch = await this.utlis.comparePassword(password, admin.password);
        if (!isPasswordMatch) {
            throw new common_1.UnauthorizedException('Invalid password');
        }
        if (!config_1.Env.jwtAdminSecret) {
            throw new common_1.InternalServerErrorException('Access secret is not defined');
        }
        const adminAccessToken = await this.generateToken(admin.id, config_1.Env.jwtAdminSecret, '1h');
        const adminUserResponse = this.utlis.adminResponse(admin);
        const responseData = (0, class_transformer_1.plainToInstance)(admin_login_dto_1.AdminLoginDto, {
            adminUser: adminUserResponse,
            accessToken: adminAccessToken,
        });
        return this.utlis.sendHttpResponse(true, common_1.HttpStatus.OK, 'Admin logged in', responseData, res);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        otp_service_1.OtpService,
        axios_1.HttpService,
        utils_1.Utils,
        Mailer_1.Mailer,
        admin_service_1.AdminService])
], AuthService);
//# sourceMappingURL=auth.service.js.map