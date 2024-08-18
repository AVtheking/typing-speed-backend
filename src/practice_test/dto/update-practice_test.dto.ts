import { PartialType } from '@nestjs/swagger';
import { CreatePracticeTestDto } from './create-practice_test.dto';

export class UpdatePracticeTestDto extends PartialType(CreatePracticeTestDto) {}
