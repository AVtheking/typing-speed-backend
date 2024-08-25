declare enum Difficulty {
    Basic = "Basic",
    Beginner = "Beginner",
    Intermediate = "Intermediate",
    Advanced = "Advanced"
}
export declare class CreatePracticeTestDto {
    title: string;
    description: string;
    difficulty: Difficulty;
}
export {};
