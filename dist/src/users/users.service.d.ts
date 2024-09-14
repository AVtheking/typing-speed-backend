import { User } from '@prisma/client';
import { Response } from 'express';
import { LoginUserDto, CreateUserDto } from '../auth/dto';
import { PrismaService } from '../prisma/prisma.service';
import { Utils } from '../utils/utils';
export declare class UsersService {
    private prisma;
    private utils;
    constructor(prisma: PrismaService, utils: Utils);
    getUserById(id: string, res: Response): Promise<Response>;
    createUser(data: CreateUserDto): Promise<User | Response>;
    updateUser(id: string, data: any): Promise<User>;
    updateUserVerificationStatus(id: string): Promise<User>;
    updateUserPassword(id: string, password: string): Promise<User>;
    updateUserEmail(id: string, email: string): Promise<User>;
    loginUser(userData: LoginUserDto): Promise<User | Response>;
    getUserByEmail(email: string): Promise<User | null>;
    changeEmail(id: string, email: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
