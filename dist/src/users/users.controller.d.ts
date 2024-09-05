import { UsersService } from './users.service';
import { Response } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UsersService);
    getUser(req: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
