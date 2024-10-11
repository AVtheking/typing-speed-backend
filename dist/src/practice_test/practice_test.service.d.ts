import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';
import { SavePracticeTestResultDto } from './dto/save-result.dto';
export declare class PracticeTestService {
    private prismaService;
    private util;
    constructor(prismaService: PrismaService, util: Utils);
    createTest(createPracticeTestDto: CreatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTest(id: string, updatePracticeTestDto: UpdatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteTest(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getPracticeTestById(practiceTestId: string, userId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getLastTwoTests(userId: string, practiceTestId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllTest(res: Response, page: number, limit: number): Promise<Response<any, Record<string, any>>>;
    trackPracticeTestProgress(practiceTestId: string, chapterId: string, completed: boolean, userId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    saveResult(saveTestResultDto: SavePracticeTestResultDto, userId: string, practiceTestId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    createCategory(createCategoryDto: CreateCategoryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCategory(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCategory(id: string, data: CreateCategoryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategoryByName(name: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategoryById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllCategories(res: Response): Promise<Response<any, Record<string, any>>>;
    getPracticeTestByCategory(categoryId: string, userId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getTestByCategoryName(category: string, userId: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
