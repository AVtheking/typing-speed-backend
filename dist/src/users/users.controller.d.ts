import { UsersService } from './users.service';
import { Response } from 'express';
import { ChangeEmailDto } from './dto/change-email.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UsersService);
    getUser(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    changeEmail(req: any, res: Response, body: ChangeEmailDto): Promise<Response<any, Record<string, any>>>;
}
