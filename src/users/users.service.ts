import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import {
  LoginUserDto,
  CreateUserDto,
  UserDto,
  VerifyOtpDto,
} from '../auth/dto';

// import { UserDto } from '../auth/dto/response-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Utils } from '../utils/utils';
import { SaveTestResultDto } from './dto/save-test-result.dto';
import { OtpService } from 'src/otp/otp.service';

import { Mailer } from 'src/utils/Mailer';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private otpService: OtpService,
    private utils: Utils,
    private mailer: Mailer,
  ) {}

  //return the user which matches the id
  async getUserById(
    id: string,
    res: Response | null,
  ): Promise<Response | User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        UserTestResult: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const userData = plainToInstance(UserDto, {
      ...user,
    });

    if (!res) {
      return user;
    }
    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'User found',
      { user: userData },
      res,
    );
  }

  async createUser(data: CreateUserDto): Promise<User | Response> {
    const { username, email, password } = data;
    const existingUsername = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (existingUsername && existingUsername.email != email) {
      throw new ConflictException('Username already taken');
    }
    //checking if the username already taken
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    //if the user is not verified then update the user details that means the user has not registered and updating his details
    //if the user is verified that means the user is already registered
    if (user) {
      if (!user.verified) {
        return this.updateUser(user.id, { username, email });
      } else {
        throw new ConflictException('Email already registered');
      }
    } else {
      //no user exists with that email in db

      //checking if the username is already taken
      // redundant check
      // user = await this.prisma.user.findUnique({
      //   where: {
      //     username,
      //   },
      // });
      // if (user) {
      //   throw new ConflictException('Username already taken');
      // }

      const hashedPassword = await this.utils.hashPassword(password);

      //creating the user and storing it in db
      return this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
    }
  }

  async updateUser(id: string, data: any): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async updateUserVerificationStatus(id: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        verified: true,
      },
    });
  }

  async updateUserPassword(id: string, password: string): Promise<User> {
    const hashedPassword = await this.utils.hashPassword(password);

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
  }

  async updateUserEmail(id: string, email: string): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email,
      },
    });
  }

  async loginUser(userData: LoginUserDto): Promise<User | Response> {
    const { email, password } = userData;
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }

    const isPasswordValid = await this.utils.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return user;
  }
  async getUserByEmail(email: string): Promise<User | null> {
    if (!email) throw new BadRequestException('Email is required');
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async changeEmail(id: string, email: string, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.verified) {
      throw new UnauthorizedException('Email not verified');
    }
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already registered');
    }
    const otp = await this.otpService.generateOtp(email);

    if (!otp) {
      throw new InternalServerErrorException('Error generating OTP');
    }
    this.mailer.sendEmailVerificationMail(email, otp);

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Otp sent to email',
      {},
      res,
    );
  }

  async verifyEmail(data: VerifyOtpDto, userId: string, res: Response) {
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

    const updatedUser = await this.updateUserEmail(userId, email);
    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Email verified successfully',
      {
        user: updatedUser,
      },
      res,
    );
  }

  async saveTestResult(
    userId: string,
    saveTestResultDto: SaveTestResultDto,
    res: Response,
  ) {
    const user = await this.getUserById(userId, null);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { wpm, accuracy, time, raw, correct, incorrect, extras, missed } =
      saveTestResultDto;

    await this.prisma.userTestResult.create({
      data: {
        wpm,
        accuracy,
        time,
        raw,
        correct,
        incorrect,
        extras,
        missed,
        userId,
      },
    });

    // add logic for rank calculation in leaderboard here

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Test result saved successfully',
      {
        wpm,
        accuracy,
        time,
        raw,
        correct,
        incorrect,
        extras,
        missed,
      },
      res,
    );
  }

  async uploadProfileImage(file, userId: string, res: Response) {
    const response = await this.utils.uploadFile(file);
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: response?.Location ?? '',
      },
    });

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Profile image uploaded successfully',
      {
        ...user,
      },
      res,
    );
  }

  async changePassword(userId: string, newPassword: string, res: Response) {
    const updatedUser = await this.updateUserPassword(userId, newPassword);

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Password changed successfully',
      {
        user: updatedUser,
      },
      res,
    );
  }
}
