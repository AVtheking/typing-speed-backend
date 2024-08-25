import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class PracticeTestService {
    private prismaService;
    constructor(prismaService: PrismaService);
    create(createPracticeTestDto: CreatePracticeTestDto): Promise<void>;
}
