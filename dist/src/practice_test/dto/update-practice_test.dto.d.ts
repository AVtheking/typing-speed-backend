import { CreateChapterDto, CreatePracticeTestDto } from './create-practice_test.dto';
declare const UpdatePracticeTestDto_base: import("@nestjs/common").Type<Partial<CreatePracticeTestDto>>;
export declare class UpdatePracticeTestDto extends UpdatePracticeTestDto_base {
    title: string;
    description: string;
    titleAndDescription: string;
    metaTitle: string;
    metaDescription: string;
    categoryId: string;
    categoryName: string;
    videoTag?: string | undefined;
    chapters: CreateChapterDto[];
}
export {};
