import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';
import { Difficulty } from '@prisma/client';
export declare class PracticeTestService {
    private prismaService;
    private util;
    constructor(prismaService: PrismaService, util: Utils);
    createTest(createPracticeTestDto: CreatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getPracticeTestById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllTest(res: Response, page: number, limit: number): Promise<Response<any, Record<string, any>>>;
    getTestByDifficulty(difficulty: Difficulty, res: Response): Promise<Response<any, Record<string, any>>>;
}
