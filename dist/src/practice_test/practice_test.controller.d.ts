import { PracticeTestService } from './practice_test.service';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
export declare class PracticeTestController {
    private readonly practiceTestService;
    constructor(practiceTestService: PracticeTestService);
    create(createPracticeTestDto: CreatePracticeTestDto): Promise<void>;
}
