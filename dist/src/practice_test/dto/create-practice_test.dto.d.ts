declare enum Difficulty {
    Basic = "Basic",
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}
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
    difficulty: Difficulty;
    chapters: CreateChapterDto[];
}
export {};
