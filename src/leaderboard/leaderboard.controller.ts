import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Months, Mode } from '@prisma/client';
import { AuthGuard } from 'src/guards';

@ApiTags('Leaderboard')
@UseGuards(AuthGuard)
@ApiBearerAuth('JWT')
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private readonly leaderboardService: LeaderboardService) {}

  @Get('daily')
  @ApiOperation({
    summary: 'Retrieve daily leaderboard',
    description:
      'Fetch the top 3 and paginated next ranks for the daily leaderboard for a specific date and mode.',
  })
  @ApiQuery({
    name: 'date',
    type: String,
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'mode',
    enum: Mode,
    description: 'Mode of the test (e.g., "15s", "30s", "60s")',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination, defaults to 1',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page, defaults to 10',
  })
  async getDailyLeaderboard(
    @Query('date') date: string,
    @Query('mode') mode: Mode,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user;
    return this.leaderboardService.getDailyLeaderboard(
      date,
      mode,
      userId,
      page,
      limit,
      res,
    );
  }

  @Get('weekly')
  @ApiOperation({
    summary: 'Retrieve weekly leaderboard',
    description:
      'Fetch the top 3 and paginated next ranks for the weekly leaderboard within a date range and specific mode.',
  })
  @ApiQuery({
    name: 'startDate',
    type: String,
    description: 'Start date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'endDate',
    type: String,
    description: 'End date in YYYY-MM-DD format',
  })
  @ApiQuery({
    name: 'mode',
    enum: Mode,
    description: 'Mode of the test (e.g., "15s", "30s", "60s")',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination, defaults to 1',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page, defaults to 10',
  })
  async getWeeklyLeaderboard(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('mode') mode: Mode,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user;
    return this.leaderboardService.getWeeklyLeaderboard(
      startDate,
      endDate,
      mode,
      userId,
      page,
      limit,
      res,
    );
  }

  @Get('monthly')
  @ApiOperation({
    summary: 'Retrieve monthly leaderboard',
    description:
      'Fetch the top 3 and paginated next ranks for the monthly leaderboard within a specified month, year, and mode.',
  })
  @ApiQuery({
    name: 'month',
    enum: Months,
    description: 'Month as a valid month enum (e.g., "January")',
  })
  @ApiQuery({ name: 'year', type: String, description: 'Year as YYYY' })
  @ApiQuery({
    name: 'mode',
    enum: Mode,
    description: 'Mode of the test (e.g., "15s", "30s", "60s")',
  })
  @ApiQuery({
    name: 'page',
    type: Number,
    required: false,
    description: 'Page number for pagination, defaults to 1',
  })
  @ApiQuery({
    name: 'limit',
    type: Number,
    required: false,
    description: 'Number of items per page, defaults to 10',
  })
  async getMonthlyLeaderboard(
    @Query('month') month: Months,
    @Query('year') year: string,
    @Query('mode') mode: Mode,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const userId = req.user;
    return this.leaderboardService.getMonthlyLeaderboard(
      month,
      year,
      mode,
      userId,
      page,
      limit,
      res,
    );
  }
}
