import { SaveResultDto } from 'src/save-test-result.dto';
export declare class SavePracticeTestResultDto extends SaveResultDto {
    time: number;
    keyPressStats: {
        key: string;
        difficultyScore: number;
    }[];
}
