import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { OtpService } from 'src/otp/otp.service';
import { UsersService } from 'src/users/users.service';
import { Mailer } from 'src/utils/Mailer';
import { Utils } from 'src/utils/utils';

export type PrismaMock = DeepMockProxy<PrismaClient>;
export type UsersServiceMock = DeepMockProxy<UsersService>;
export type OtpServiceMock = DeepMockProxy<OtpService>;
export type JwtServiceMock = DeepMockProxy<JwtService>;
export type HttpServiceMock = DeepMockProxy<HttpService>;
export type UtilsMock = DeepMockProxy<Utils>;
export type MailerMock = DeepMockProxy<Mailer>;

export const prismaMock = mockDeep<PrismaClient>();
export const userServiceMock = mockDeep<UsersService>();
export const otpServiceMock = mockDeep<OtpService>();
export const jwtServiceMock = mockDeep<JwtService>();
export const httpServiceMock = mockDeep<HttpService>();
export const utilsMock = mockDeep<Utils>();
export const mailerMock = mockDeep<Mailer>();
