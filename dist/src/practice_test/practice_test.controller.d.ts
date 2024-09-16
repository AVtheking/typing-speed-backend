import { PracticeTestService } from './practice_test.service';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { Response } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';
export declare class PracticeTestController {
    private practiceTestService;
    constructor(practiceTestService: PracticeTestService);
    createCategory(createCategoryDto: CreateCategoryDto, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllCategory(res: Response): Promise<Response<any, Record<string, any>>>;
    getCategoryByName(name: string, res: Response): Promise<Response<any, Record<string, any>>>;
    updateCategory(createCategoryDto: CreateCategoryDto, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteCategory(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    createTest(createPracticeTestDto: CreatePracticeTestDto, res: Response): Promise<Response<any, Record<string, any>>>;
    updatePracticeTest(updatePracticeTestDto: UpdatePracticeTestDto, id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    deletePracticeTest(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
    getAllTest(page: number | undefined, limit: number | undefined, res: Response): Promise<Response<any, Record<string, any>>>;
    getTestById(id: string, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    getTestByCategory(categoryId: string, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    getTestByCategoryName(category: string, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    updateChapterCompleted(practiceTestId: string, chapterId: string, completed: boolean, req: any, res: Response): Promise<Response<any, Record<string, any>>>;
    getCategoryById(id: string, res: Response): Promise<Response<any, Record<string, any>>>;
}
