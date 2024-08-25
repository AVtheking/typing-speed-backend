import { IsDefined, IsEnum, IsString } from 'class-validator';

enum Difficulty {
  Basic = 'Basic',
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export class CreatePracticeTestDto {
  @IsString()
  @IsDefined()
  title: string;

  @IsString()
  description: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
