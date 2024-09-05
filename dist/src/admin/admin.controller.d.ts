import { AdminService } from './admin.service';
import { AdminSettingDto } from './dto/admin_settings.dto';
import { Response } from 'express';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    updateAdminSettings(data: AdminSettingDto, res: Response, file: Express.Multer.File): Promise<Response<any, Record<string, any>>>;
}
