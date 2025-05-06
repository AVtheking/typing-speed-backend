import { SaveResultDto } from 'src/save-test-result.dto';
export declare enum Mode {
    FifteenSeconds = "15s",
    ThirtySeconds = "30s",
    SixtySeconds = "60s"
}
export declare class SaveTestResultDto extends SaveResultDto {
    mode: Mode;
}
