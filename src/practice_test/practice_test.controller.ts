import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PracticeTestService } from './practice_test.service';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';

import { AdminGuard } from 'src/guards';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';

@ApiTags('Practice Test')
@Controller()
export class PracticeTestController {
  constructor(private practiceTestService: PracticeTestService) {}

  @ApiTags('Admin')
  @UseGuards(AdminGuard)
  @Post('/admin/createCategory')
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Practice test data to create a new category ',
  })
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    return this.practiceTestService.createCategory(createCategoryDto, res);
  }

  @ApiTags('Category')
  @Get('/allCategories')
  async getAllCategory(@Res() res: Response) {
    return this.practiceTestService.getAllCategories(res);
  }

  @ApiTags('Category')
  @Get('category/:id')
  async getCategoryById(@Param('id') id: string, @Res() res: Response) {
    return this.practiceTestService.getCategoryById(id, res);
  }

  @ApiTags('Category')
  @Get('category')
  async getCategoryByName(@Query('name') name: string, @Res() res: Response) {
    return this.practiceTestService.getCategoryByName(name, res);
  }

  @ApiTags('Admin')
  @UseGuards(AdminGuard)
  @Put('/admin/updateCategory/:id')
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Practice test data to update a category',
  })
  updateCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.practiceTestService.updateCategory(id, createCategoryDto, res);
  }

  @ApiTags('Admin')
  @Delete('/admin/deleteCategory/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT')
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    return this.practiceTestService.deleteCategory(id, res);
  }

  @ApiTags('Admin')
  @Post('/admin/createPracticeTest')
  @UseGuards(AdminGuard)
  @ApiConsumes('application/json')
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: CreatePracticeTestDto,
    description: 'Practice test data to create a new practice test',
  })
  @ApiResponse({
    status: 201,
    description: 'Practice test created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Practice test created successfully',
        data: {
          id: 'cuid_generated_id',
          title: 'Typing Speed Test',
          description: 'A test to measure your typing speed.',
          titleAndDescription:
            'Typing Speed Test - A test to measure your typing speed.',
          metaTitle: 'Typing Test',
          metaDescription: 'Measure your typing speed with this practice test.',
          difficulty: 'Beginner',
          createdAt: '2024-08-31T12:34:56.789Z',
          updatedAt: '2024-08-31T12:34:56.789Z',
          chapters: [
            {
              id: 'cuid_generated_id_1',
              title: 'Introduction to typing',
              description: 'This chapter covers the basics of typing.',
              layout: 'BoxLayout',
              practiceTestId: 'cuid_generated_id',
              createdAt: '2024-08-31T12:34:56.789Z',
              updatedAt: '2024-08-31T12:34:56.789Z',
            },
            {
              id: 'cuid_generated_id_2',
              title: 'Typing techniques',
              description: 'This chapter covers various typing techniques.',
              layout: 'LineLayout',
              practiceTestId: 'cuid_generated_id',
              createdAt: '2024-08-31T12:34:56.789Z',
              updatedAt: '2024-08-31T12:34:56.789Z',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error creating practice test',
    schema: {
      example: {
        statusCode: 400,
        message: 'Error creating practice test',
        error: 'Detailed error message here',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'User not authorized.',
  })
  createTest(
    @Body() createPracticeTestDto: CreatePracticeTestDto,
    @Res() res: Response,
  ) {
    return this.practiceTestService.createTest(createPracticeTestDto, res);
  }

  @ApiTags('Admin')
  @UseGuards(AdminGuard)
  @Put('/admin/updatePracticeTest/:id')
  @ApiBearerAuth('JWT')
  @ApiBody({
    type: UpdatePracticeTestDto,
    description: 'Practice test data to update a  practice test',
  })
  updatePracticeTest(
    @Body() updatePracticeTestDto: UpdatePracticeTestDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.practiceTestService.updateTest(id, updatePracticeTestDto, res);
  }

  @Delete('/admin/deletePracticeTest/:id')
  @ApiTags('Admin')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT')
  async deletePracticeTest(@Param('id') id: string, @Res() res: Response) {
    return this.practiceTestService.deleteTest(id, res);
  }

  @ApiTags('Practice Test')
  @Get('practiceTest')
  async getAllTest(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res: Response,
  ) {
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    return this.practiceTestService.getAllTest(res, page, limit);
  }

  @Get('practiceTest/:id')
  @ApiTags('Practice Test')
  async getTestById(@Param('id') id: string, @Res() res: Response) {
    return this.practiceTestService.getPracticeTestById(id, res);
  }

  @ApiTags('Practice Test')
  @Get('practiceTest/:categoryId')
  async getTestByCategory(
    @Param('categoryId') categoryId: string,
    @Res() res: Response,
  ) {
    return this.practiceTestService.getPracticeTestByCategory(categoryId, res);
  }
  // @ApiTags('Practice Test')
  // @Get('practiceTest/:level')
  // async getTestByLevel(
  //   @Param('level') level: Difficulty,
  //   @Res() res: Response,
  // ) {
  //   return this.practiceTestService.getTestByDifficulty(level, res);
  // }
}
