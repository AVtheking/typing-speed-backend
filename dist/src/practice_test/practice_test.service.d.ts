import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';
export declare class PracticeTestService {
    private prismaService;
    private util;
    constructor(prismaService: PrismaService, util: Utils);
    create(createPracticeTestDto: CreatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
