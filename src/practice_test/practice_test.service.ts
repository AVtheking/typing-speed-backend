import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';
import { Difficulty } from '@prisma/client';

@Injectable()
export class PracticeTestService {
  constructor(
    private prismaService: PrismaService,
    private util: Utils,
  ) {}
  async createTest(
    createPracticeTestDto: CreatePracticeTestDto,
    res: Response,
  ) {
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

  //return specific practice test by id
  async getPracticeTestById(id: string, res: Response) {
    const practiceTest = await this.prismaService.practiceTest.findUnique({
      where: {
        id,
      },
      include: {
        Chapter: true,
      },
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Test found',
      practiceTest,
      res,
    );
  }

  //return all practice tests
  //paginated data

  async getAllTest(res: Response, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [practiceTests, totalCount] = await Promise.all([
      this.prismaService.practiceTest.findMany({
        include: {
          Chapter: true,
        },
        skip: skip,
        take: limit,
      }),
      this.prismaService.practiceTest.count(),
    ]);
    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Tests found',
      {
        practiceTests,
        pagination: {
          total: totalCount,
          page,
          totalPages: Math.ceil(totalCount / limit),
          limit,
        },
      },
      res,
    );
  }

  /*
   returns the list of test according to  difficulty
  */
  async getTestByDifficulty(difficulty: Difficulty, res: Response) {
    const practiceTest = await this.prismaService.practiceTest.findMany({
      where: {
        difficulty,
      },
      include: {
        Chapter: true,
      },
    });
    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Test found',
      practiceTest,
      res,
    );
  }
}
