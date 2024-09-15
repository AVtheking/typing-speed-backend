import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PracticeTestService } from './practice_test.service';
import { CreatePracticeTestDto } from './dto/create-practice_test.dto';

import { AdminGuard, AuthGuard } from 'src/guards';
import { Response } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiOperation, // Added import
} from '@nestjs/swagger';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdatePracticeTestDto } from './dto/update-practice_test.dto';

@Controller()
export class PracticeTestController {
  constructor(private practiceTestService: PracticeTestService) {}

  @ApiTags('Admin')
  @UseGuards(AdminGuard)
  @Post('/admin/category')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Create a new practice test category with the provided data.',
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Practice test data to create a new category',
  })
  createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
    @Res() res: Response,
  ) {
    return this.practiceTestService.createCategory(createCategoryDto, res);
  }

  @ApiTags('Category')
  @ApiOperation({
    summary: 'Retrieve all categories',
    description: 'Fetch a list of all practice test categories.',
  })
  @Get('/categoriesf')
  async getAllCategory(@Res() res: Response) {
    return this.practiceTestService.getAllCategories(res);
  }

  @ApiTags('Category')
  @ApiOperation({
    summary: 'Get category by ID',
    description: 'Retrieve a specific category using its unique identifier.',
  })
  @Get('category/:id')
  async getCategoryById(@Param('id') id: string, @Res() res: Response) {
    return this.practiceTestService.getCategoryById(id, res);
  }

  @ApiTags('Category')
  @ApiOperation({
    summary: 'Get category by name',
    description: 'Retrieve a specific category using its name.',
  })
  @Get('category')
  async getCategoryByName(@Query('name') name: string, @Res() res: Response) {
    return this.practiceTestService.getCategoryByName(name, res);
  }

  @ApiTags('Admin')
  @UseGuards(AdminGuard)
  @Put('/admin/category/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Update a category',
    description:
      'Update an existing practice test category with the provided data.',
  })
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
  @Delete('/admin/category/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Remove a practice test category by its ID.',
  })
  async deleteCategory(@Param('id') id: string, @Res() res: Response) {
    return this.practiceTestService.deleteCategory(id, res);
  }

  @ApiTags('Admin')
  @Post('/admin/practice-test')
  @UseGuards(AdminGuard)
  @ApiConsumes('application/json')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Create a new practice test',
    description: 'Create a new practice test with the provided data.',
  })
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
              embedCode: 'j j j j a a a',
              layout: 'BoxLayout',
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
  @Put('/admin/practice-test/:id')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Update a practice test',
    description: 'Update an existing practice test with the provided data.',
  })
  @ApiBody({
    type: UpdatePracticeTestDto,
    description: 'Practice test data to update a practice test',
  })
  updatePracticeTest(
    @Body() updatePracticeTestDto: UpdatePracticeTestDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    return this.practiceTestService.updateTest(id, updatePracticeTestDto, res);
  }

  @ApiTags('Admin')
  @Delete('/admin/practice-test/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Delete a practice test',
    description: 'Remove a practice test by its ID.',
  })
  @ApiBody({
    description: 'Delete a practice test',
  })
  async deletePracticeTest(@Param('id') id: string, @Res() res: Response) {
    return this.practiceTestService.deleteTest(id, res);
  }

  @ApiTags('Practice Test')
  @ApiOperation({
    summary: 'Retrieve all practice tests',
    description: 'Fetch a paginated list of all available practice tests.',
  })
  @Get('practice-test/all')
  async getAllTest(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Res() res: Response,
  ) {
    page = page > 0 ? page : 1;
    limit = limit > 0 ? limit : 10;
    return this.practiceTestService.getAllTest(res, page, limit);
  }

  @UseGuards(AuthGuard)
  @Get('practice-test/')
  @ApiTags('Practice Test')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get a practice test by ID',
    description:
      'Retrieve detailed information of a specific practice test by its ID.',
  })
  async getTestById(
    @Query('id') id: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user;
    return this.practiceTestService.getPracticeTestById(id, userId, res);
  }

  @ApiTags('Practice Test')
  @UseGuards(AuthGuard)
  @Get('category/practice-test/:categoryId')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get practice tests by category ID',
    description:
      'Retrieve all practice tests under a specific category using the category ID.',
  })
  async getTestByCategory(
    @Param('categoryId') categoryId: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user;
    return this.practiceTestService.getPracticeTestByCategory(
      categoryId,
      userId,
      res,
    );
  }

  // Uncomment and add ApiOperation if needed
  // @ApiTags('Practice Test')
  // @Put('practiceTest/lastTaken/:id')
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth('JWT')
  // @ApiOperation({
  //   summary: 'Update last taken test',
  //   description: 'Update the last taken timestamp for a specific practice test.',
  // })
  // async updateLastTaken(
  //   @Param('id') id: string,
  //   @Req() req: any,
  //   @Res() res: Response,
  // ) {
  //   const userId = req.user;
  //   return this.practiceTestService.updateLastTakenTest(id, userId, res);
  // }

  @ApiTags('Practice Test')
  @UseGuards(AuthGuard)
  @Get('category/practice-test')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get practice tests by category name',
    description:
      'Retrieve all practice tests under a specific category using the category name.',
  })
  async getTestByCategoryName(
    @Query('category') category: string,
    @Res() res: Response,
  ) {
    return this.practiceTestService.getTestByCategoryName(category, res);
  }

  @UseGuards(AuthGuard)
  @ApiTags('Practice Test')
  @Put('practice-test/progress/')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Update chapter completion status',
    description:
      'Update the completion status of a specific chapter within a practice test.',
  })
  async updateChapterCompleted(
    @Query('practiceTestId') practiceTestId: string,
    @Query('chapterId') chapterId: string,
    @Query('completed') completed: boolean,
    @Req() req: any,
    @Res() res: Response,
  ) {
    const userId = req.user;
    return this.practiceTestService.trackPracticeTestProgress(
      practiceTestId,
      chapterId,
      completed,
      userId,
      res,
    );
  }
}
