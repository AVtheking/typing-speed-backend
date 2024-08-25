import { Injectable } from '@nestjs/common';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PracticeTestService {
  constructor(private prismaService: PrismaService) {}
  async create(createPracticeTestDto: CreatePracticeTestDto) {
    const { title, description, difficulty } = createPracticeTestDto;
    await this.prismaService.practiceTest.create({
      data: {
        title,
        description,
        difficulty,
      },
    });
  }
}
