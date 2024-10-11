import { SaveResultDto } from 'src/save-test-result.dto';
export declare class SavePracticeTestResultDto extends SaveResultDto {
    keyPressStats: {
        key: string;
        difficultyScore: number;
    }[];
}
