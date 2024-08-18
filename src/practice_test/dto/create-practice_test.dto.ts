import { IsDefined, IsString } from 'class-validator';

export class CreatePracticeTestDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsString()
  description: string;
}
