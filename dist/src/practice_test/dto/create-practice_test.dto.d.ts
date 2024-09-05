declare enum Layout {
    BoxLayout = "BoxLayout",
    LineLayout = "LineLayout"
}
export declare class CreateChapterDto {
    title: string;
    description: string;
    layout: Layout;
}
export declare class CreatePracticeTestDto {
    title: string;
    description: string;
    titleAndDescription: string;
    metaTitle: string;
    metaDescription: string;
    categoryId: string;
    categoryName: string;
    videoTag: string;
    chapters: CreateChapterDto[];
}
export {};
