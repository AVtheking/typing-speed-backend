import { UsersService } from './users.service';
import { Response } from 'express';
import { ChangeEmailDto } from './dto/change-email.dto';
import { SaveTestResultDto } from './dto/save-test-result.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UsersService);
    getUser(req: any, res: Response): Promise<Response<any, Record<string, any>> | {
        id: string;
        email: string;
        username: string;
        password: string;
        profileImage: string | null;
        verified: boolean;
        matchPlayed: number;
        matchWon: number;
        matchLost: number;
        avgWpm: number;
        avgAccuracy: number;
        rank: number | null;
        createdAt: Date;
        updatedAt: Date;
        lastTakenTestId: string | null;
    }>;
    changeEmail(req: any, res: Response, body: ChangeEmailDto): Promise<Response<any, Record<string, any>>>;
    verifyEmail(req: any, res: Response, body: VerifyOtpDto): Promise<Response<any, Record<string, any>>>;
    saveTest(req: any, res: Response, body: SaveTestResultDto): Promise<Response<any, Record<string, any>>>;
    updateProfileImage(req: any, res: Response, file: Express.Multer.File): Promise<Response<any, Record<string, any>> | undefined>;
}
