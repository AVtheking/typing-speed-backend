import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';

@Injectable()
export class PracticeTestService {
  constructor(
    private prismaService: PrismaService,
    private util: Utils,
  ) {}
  async create(createPracticeTestDto: CreatePracticeTestDto, res: Response) {
    const { chapters, ...practiceTestData } = createPracticeTestDto;
    const practiceTest = await this.prismaService.practiceTest.create({
      data: {
        ...practiceTestData,
        Chapter: {
          create: chapters,
        },
      },
      include: {
        Chapter: true,
      },
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.CREATED,
      'Practice Test created',
      practiceTest,
      res,
    );
  }
}
