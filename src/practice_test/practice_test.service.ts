import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Response } from 'express';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';
import { PracticeTestProgress } from '@prisma/client';

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
    const { title, categoryId } = practiceTestData;
    const existingTest = await this.prismaService.practiceTest.findUnique({
      where: {
        title,
      },
    });

    if (existingTest) {
      throw new ConflictException('Lesson with this title already exists');
    }
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.name !== practiceTestData.categoryName) {
      throw new ConflictException('Category name does not match');
    }

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

  async updateTest(
    id: string,
    updatePracticeTestDto: UpdatePracticeTestDto,
    res: Response,
  ) {
    const { chapters, ...practiceTestData } = updatePracticeTestDto;
    let practiceTest = await this.prismaService.practiceTest.findUnique({
      where: {
        id: id,
      },
    });

    const { categoryId } = practiceTestData;
    const category = await this.prismaService.category.findUnique({
      where: {
        id: categoryId,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (category.name !== practiceTestData.categoryName) {
      throw new ConflictException('Category does not match');
    }
    if (!practiceTest) {
      throw new NotFoundException('Practice Test not found');
    }
    const existingTest = await this.prismaService.practiceTest.findUnique({
      where: {
        title: practiceTestData.title,
      },
    });
    if (existingTest && existingTest.id !== id) {
      throw new ConflictException('Lesson with this title already exists');
    }
    practiceTest = await this.prismaService.practiceTest.update({
      where: {
        id,
      },
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
      HttpStatus.OK,
      'Practice Test updated',
      practiceTest,
      res,
    );
  }

  async deleteTest(id: string, res: Response) {
    const practiceTest = await this.prismaService.practiceTest.findUnique({
      where: {
        id,
      },
    });

    if (!practiceTest) {
      throw new NotFoundException('Practice Test not found');
    }

    await this.prismaService.practiceTest.delete({
      where: {
        id,
      },
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Test deleted',
      null,
      res,
    );
  }
  //return specific practice test by id
  async getPracticeTestById(
    practiceTestId: string,
    userId: string,
    res: Response,
  ) {
    const practiceTest = await this.prismaService.practiceTest.findUnique({
      where: {
        id: practiceTestId,
      },
      include: {
        Chapter: true,
      },
    });

    if (!practiceTest) {
      throw new NotFoundException('Practice Test not found');
    }

    await this.prismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        lastTakenTestId: practiceTestId,
      },
    });

    const progressRecord =
      await this.prismaService.practiceTestProgress.findUnique({
        where: {
          userId_practiceTestId: {
            userId,
            practiceTestId,
          },
        },
      });

    const chapterProgress = await this.prismaService.userProgress.findMany({
      where: {
        userId: userId,
        chapter: {
          practiceTestId: practiceTestId,
        },
      },
    });

    // Create a map of chapter completion statuses for quick lookup
    const progressMap = chapterProgress.reduce((acc, progress) => {
      acc[progress.chapterId] = progress.completed;
      return acc;
    }, {});

    const chapterWithProgress = practiceTest.Chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      embedCode: chapter.embedCode,
      layout: chapter.layout,
      completed: progressMap[chapter.id] || false,
    }));

    const response = {
      ...practiceTest,
      Chapter: chapterWithProgress,
      progress: progressRecord?.progress || 0,
      lastPlayedChapter: progressRecord?.lastPlayedChapterId || null,
    };

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Test found',
      response,
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
          _count: {
            select: {
              Chapter: true,
            },
          },
        },
        skip: skip,
        take: limit,
      }),
      this.prismaService.practiceTest.count(),
    ]);
    const formattedPracticeTests = practiceTests.map((practiceTest) => ({
      ...practiceTest,
      totalChapters: practiceTest._count.Chapter,
    }));

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Tests found',
      {
        practiceTests: formattedPracticeTests,
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

  async trackPracticeTestProgress(
    practiceTestId: string,
    chapterId: string,
    completed: boolean,
    userId: string,
    res: Response,
  ) {
    await this.prismaService.userProgress.upsert({
      where: {
        userId_chapterId: { userId, chapterId },
      },
      update: { completed },
      create: { userId, chapterId, completed },
    });

    const totalChapters = await this.prismaService.chapter.count({
      where: {
        practiceTestId,
      },
    });

    const completedChapters = await this.prismaService.userProgress.count({
      where: {
        userId,
        chapterId,
        completed: true,
      },
    });

    const progress = Math.floor(completedChapters / totalChapters);

    await this.prismaService.practiceTestProgress.upsert({
      where: {
        userId_practiceTestId: { userId, practiceTestId },
      },
      update: { progress, lastPlayedChapterId: chapterId },
      create: {
        userId,
        practiceTestId,
        progress,
        lastPlayedChapterId: chapterId,
      },
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Progress updated',
      {
        progress: progress * 100,
        lastPlayedChapterId: chapterId,
      },
      res,
    );
  }

  //-----------------Category-----------------------------------------------

  async createCategory(createCategoryDto: CreateCategoryDto, res: Response) {
    const { name } = createCategoryDto;
    const existingCategory = await this.prismaService.category.findUnique({
      where: {
        name,
      },
    });
    if (existingCategory) {
      throw new ConflictException('Category already exists');
    }
    const category = await this.prismaService.category.create({
      data: createCategoryDto,
    });
    return this.util.sendHttpResponse(
      true,
      HttpStatus.CREATED,
      'Category created',
      category,
      res,
    );
  }

  async deleteCategory(id: string, res: Response) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.prismaService.category.delete({
      where: {
        id,
      },
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Category deleted',
      null,
      res,
    );
  }

  async updateCategory(id: string, data: CreateCategoryDto, res: Response) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    const existingCategory = await this.prismaService.category.findUnique({
      where: {
        name: data.name,
      },
    });
    if (existingCategory && existingCategory.id !== id) {
      throw new ConflictException('Category already exists');
    }

    const updatedCategory = await this.prismaService.category.update({
      where: {
        id,
      },
      data,
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Category updated',
      updatedCategory,
      res,
    );
  }

  async getCategoryByName(name: string, res: Response) {
    const category = await this.prismaService.category.findUnique({
      where: {
        name,
      },
      include: {
        PracticeTest: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Category found',
      category,
      res,
    );
  }

  async getCategoryById(id: string, res: Response) {
    const category = await this.prismaService.category.findUnique({
      where: {
        id,
      },
      include: {
        PracticeTest: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Category found',
      category,
      res,
    );
  }

  /*
   return all the categories created by admin
  */
  async getAllCategories(res: Response) {
    const categories = await this.prismaService.category.findMany({
      include: {
        _count: {
          select: { PracticeTest: true },
        },
      },
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Categories found',
      categories.map((category) => ({
        ...category,
        totalPracticeTests: category._count.PracticeTest,
      })),
      res,
    );
  }

  async getPracticeTestByCategory(
    categoryId: string,
    userId: string,
    res: Response,
  ) {
    const practiceTests = await this.prismaService.practiceTest.findMany({
      where: {
        categoryId,
      },
      include: {
        _count: {
          select: {
            Chapter: true,
          },
        },
      },
    });

    if (!practiceTests) {
      throw new NotFoundException('Practice Tests not found');
    }
    const progressRecord =
      await this.prismaService.practiceTestProgress.findMany({
        where: {
          userId,
          practiceTestId: {
            in: practiceTests.map((test) => test.id),
          },
        },
      });

    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        lastTakenTestId: true,
      },
    });

    //converting progressRecord array to map
    const progressMap: Record<string, PracticeTestProgress> =
      progressRecord.reduce((acc, record) => {
        acc[record.practiceTestId] = record;
        return acc;
      }, {});

    const tests = practiceTests.map((test) => {
      const progressRecord = progressMap[test.id];
      const progress = progressRecord ? progressRecord.progress : 0;
      const lastPlayedChapterId = progressRecord
        ? progressRecord.lastPlayedChapterId
        : null;

      return {
        id: test.id,
        title: test.title,
        description: test.description,
        lastTakenTest: user?.lastTakenTestId === test.id,
        progress,
        lastPlayedChapter: lastPlayedChapterId,
      };
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Tests found',
      { practiceTests: tests },
      res,
    );
  }

  async getTestByCategoryName(category: string, res: Response) {
    console.log(category);
    const categoryData = await this.prismaService.category.findUnique({
      where: {
        name: category,
      },
    });

    if (!categoryData) {
      throw new NotFoundException('Category not found');
    }

    const practiceTests = await this.prismaService.practiceTest.findMany({
      where: {
        categoryId: categoryData.id,
      },
      include: {
        _count: {
          select: {
            Chapter: true,
          },
        },
      },
    });

    return this.util.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Practice Tests found',
      practiceTests,
      res,
    );
  }
}
