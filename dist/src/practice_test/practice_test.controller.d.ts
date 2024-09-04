import { PracticeTestService } from './practice_test.service';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { Response } from 'express';
import { Difficulty } from '@prisma/client';
export declare class PracticeTestController {
    private practiceTestService;
    constructor(practiceTestService: PracticeTestService);
    create(createPracticeTestDto: CreatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllTest(page: number | undefined, limit: number | undefined, res: Response): Promise<Response<any, Record<string, any>>>;
    getTestByLevel(level: Difficulty, res: Response): Promise<Response<any, Record<string, any>>>;
}
