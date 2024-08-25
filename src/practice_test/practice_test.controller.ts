import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PracticeTestService } from './practice_test.service';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';
import { AdminGuard } from 'src/guards';

@Controller('practice-test')
export class PracticeTestController {
  constructor(private readonly practiceTestService: PracticeTestService) {}

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() createPracticeTestDto: CreatePracticeTestDto) {
    return this.practiceTestService.create(createPracticeTestDto);
  }
}
