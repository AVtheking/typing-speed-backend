import { PracticeTestService } from './practice_test.service';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { Response } from 'express';
export declare class PracticeTestController {
    private practiceTestService;
    constructor(practiceTestService: PracticeTestService);
    create(createPracticeTestDto: CreatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
}
