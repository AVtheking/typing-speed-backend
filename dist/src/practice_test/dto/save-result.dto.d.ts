export declare class SaveTestResultDto {
    practiceTestId: string;
    wpm: number;
    accuracy: number;
    time: number;
    raw: number;
    correct: number;
    incorrect: number;
    extras: number;
    missed: number;
    keyPressStats: {
        key: string;
        difficultyScore: number;
    }[];
}
