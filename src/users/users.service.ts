import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '@prisma/client';

import { plainToInstance } from 'class-transformer';
import { Response } from 'express';
import { LoginUserDto, CreateUserDto, UserDto } from '../auth/dto';

// import { UserDto } from '../auth/dto/response-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Utils } from '../utils/utils';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private utils: Utils,
  ) {}

  //return the user which matches the id
  async getUserById(id: string, res: Response): Promise<Response> {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });
    const userData = plainToInstance(UserDto, {
      ...user,
    });

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
    let user = await this.prisma.user.findUnique({
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
      user = await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
      if (user) {
        throw new ConflictException('Username already taken');
      }

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
}
