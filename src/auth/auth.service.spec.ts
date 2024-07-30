import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import {
  httpServiceMock,
  jwtServiceMock,
  mailerMock,
  otpServiceMock,
  prismaMock,
  userServiceMock,
  utilsMock,
} from '../../src/mocks/mocks';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';
import { OtpService } from '../../src/otp/otp.service';
import { HttpService } from '@nestjs/axios';
import { Utils } from '../../src/utils/utils';

import { Mailer } from '../../src/utils/Mailer';
import { InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { User } from '@prisma/client';
import { Response } from 'express';

const mockUser: User = {
  id: '1',
  email: 'test@gmail.com ',
  username: 'test',
  password: 'password',
  verified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const mockUserVerified: User = {
  id: '1',
  email: 'test@gmail.com ',
  username: 'test',
  password: 'password',
  verified: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};
describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtServiceMock,
        },
        {
          provide: UsersService,
          useValue: userServiceMock,
        },
        {
          provide: OtpService,
          useValue: otpServiceMock,
        },
        {
          provide: HttpService,
          useValue: httpServiceMock,
        },
        {
          provide: Utils,
          useValue: utilsMock,
        },
        {
          provide: Mailer,
          useValue: mailerMock,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should generate a JWT token', async () => {
    const userId = '1';
    const secret = 'secret';
    const expiresIn = '1d';

    jwtServiceMock.sign.mockReturnValue('token');

    const result = await authService.generateToken(userId, secret, expiresIn);
    expect(result).toBeDefined();
    expect(result).toEqual('token');
  });

  it('should throw internal server error if the secret is not present ', async () => {
    await expect(
      authService.generateToken('1', undefined, '1h'),
    ).rejects.toThrow(InternalServerErrorException);
  });

  describe('signUp', () => {
    it('should create a user and send otp', async () => {
      const res = {} as Response;
      const signUpData: CreateUserDto = {
        email: 'test@example.com',
        password: 'password',
        username: 'test',
      };

      userServiceMock.createUser.mockResolvedValue(mockUser);
      otpServiceMock.generateOtp.mockResolvedValue(123456);

      await authService.signUp(signUpData, res);

      expect(userServiceMock.createUser).toHaveBeenCalledWith(signUpData);
      expect(otpServiceMock.generateOtp).toHaveBeenCalledWith(signUpData.email);
      expect(mailerMock.sendEmailVerificationMail).toHaveBeenCalledWith(
        signUpData.email,
        123456,
      );
    });
  });
});
