import { Admin, User } from '@prisma/client';
import { Response } from 'express';
import { UserDto } from '../auth/dto/response-user.dto';
import { AdminUserDto } from 'src/auth/dto/admin-login.dto';
export declare class Utils {
    constructor();
    sendHttpResponse(success: boolean, statusCode: number, message: string, data: any, res: Response): Promise<Response<any, Record<string, any>>>;
    randomPassword(): string;
    randomInteger(min: number, max: number): number;
    userResponse(user: User): UserDto;
    adminResponse(admin: Admin): AdminUserDto;
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashPassword: string): Promise<boolean>;
}
