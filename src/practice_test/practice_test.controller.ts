import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
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

@ApiTags('Admin')
@Controller('practice-test')
export class PracticeTestController {
  constructor(private practiceTestService: PracticeTestService) {}

  @Post()
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
  create(
    @Body() createPracticeTestDto: CreatePracticeTestDto,
    @Res() res: Response,
  ) {
    return this.practiceTestService.create(createPracticeTestDto, res);
  }
}
