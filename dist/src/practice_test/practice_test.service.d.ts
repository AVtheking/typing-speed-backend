import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';
export declare class PracticeTestService {
    private prismaService;
    private util;
    constructor(prismaService: PrismaService, util: Utils);
    createTest(createPracticeTestDto: CreatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updateTest(id: string, updatePracticeTestDto: UpdatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteTest(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getPracticeTestById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllTest(res: Response, page: number, limit: number): Promise<Response<any, Record<string, any>>>;
    createCategory(createCategoryDto: CreateCategoryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCategory(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCategory(id: string, data: CreateCategoryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategoryByName(name: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategoryById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllCategories(res: Response): Promise<Response<any, Record<string, any>>>;
    getPracticeTestByCategory(categoryId: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getTestByCategoryName(category: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
