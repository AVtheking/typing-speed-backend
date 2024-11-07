import {
  BadRequestException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Months, Mode } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { Mode as DtoMode } from '../users/dto/save-test-result.dto';
import { REDIS_CLIENT_TOKEN } from 'src/redis/redis.module';
import Redis from 'ioredis';

@Injectable()
export class LeaderboardService {
  constructor(
    @Inject(REDIS_CLIENT_TOKEN) private readonly redisClient: Redis,
    private prismaService: PrismaService,
    private utils: Utils,
  ) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateLeaderboardFromRedis() {
    const modes: DtoMode[] = [
      DtoMode.FifteenSeconds,
      DtoMode.ThirtySeconds,
      DtoMode.SixtySeconds,
    ];

    const leaderboardTypes = ['daily', 'weekly', 'monthly'];
    try {
      for (const mode of modes) {
        for (const type of leaderboardTypes) {
          const redisKeyPattern = `leaderboard:${type}:${mode}:*`;
          const keys = await this.redisClient.keys(redisKeyPattern);

          // Filter to include only sorted set keys (keys with exactly 4 parts)
          const sortedSetKeys = keys.filter(
            (key) => key.split(':').length === 4,
          );

          for (const key of sortedSetKeys) {
            const dateIdentifier = key.split(':').pop();
            if (!dateIdentifier) {
              continue;
            }

            // Fetch leaderboard entries from the sorted set
            const leaderboardEntries = await this.redisClient.zrevrange(
              key,
              0,
              -1,
              'WITHSCORES',
            );

            for (let i = 0; i < leaderboardEntries.length; i += 2) {
              const userId = leaderboardEntries[i];
              console.log(userId);
              const score = parseInt(leaderboardEntries[i + 1]);
              const userHashKey = `${key}:${userId}`;

              const wpm = parseInt(
                (await this.redisClient.hget(userHashKey, 'wpm')) || '0',
              );
              const raw = parseInt(
                (await this.redisClient.hget(userHashKey, 'raw')) || '0',
              );
              const accuracy = parseInt(
                (await this.redisClient.hget(userHashKey, 'accuracy')) || '0',
              );

              const data = {
                userId,
                score,
                wpm,
                raw,
                accuracy,
                mode: this.utils.mapDtoModeToPrismaMode(mode),
              };

              switch (type) {
                case 'daily':
                  data['date'] = new Date(dateIdentifier);
                  await this.prismaService.leaderBoardDaily.upsert({
                    where: {
                      userId_mode_date: {
                        userId: data.userId,
                        mode: data.mode,
                        date: data['date'],
                      },
                    },
                    update: {
                      score: data.score,
                      wpm: data.wpm,
                      raw: data.raw,
                      accuracy: data.accuracy,
                    },
                    create: {
                      userId: data.userId,
                      mode: data.mode,
                      date: data['date'],
                      score: data.score,
                      wpm: data.wpm,
                      raw: data.raw,
                      accuracy: data.accuracy,
                    },
                  });
                  break;

                case 'weekly':
                  const [yearstr, weekstr] = dateIdentifier.split('-W');
                  const year = parseInt(yearstr, 10);
                  const week = parseInt(weekstr, 10);
                  const { startDate, endDate } =
                    this.utils.getStartAndEndOfWeek(year, week);

                  await this.prismaService.leaderBoardWeekly.upsert({
                    where: {
                      userId_mode_startDate_endDate: {
                        userId: data.userId,
                        mode: data.mode,
                        startDate,
                        endDate,
                      },
                    },
                    update: {
                      score: data.score,
                      wpm: data.wpm,
                      raw: data.raw,
                      accuracy: data.accuracy,
                    },
                    create: {
                      userId: data.userId,
                      mode: data.mode,
                      startDate,
                      endDate,
                      score: data.score,
                      wpm: data.wpm,
                      raw: data.raw,
                      accuracy: data.accuracy,
                    },
                  });
                  break;

                case 'monthly':
                  const [yearStrMonthly, monthStrMonthly] =
                    dateIdentifier.split('-');
                  const yearMonthly = parseInt(yearStrMonthly, 10);
                  const month = parseInt(monthStrMonthly, 10);
                  const monthString: Months =
                    this.utils.monthFromMonthNumber(month);

                  await this.prismaService.leaderBoardMonthly.upsert({
                    where: {
                      userId_mode_month_year: {
                        userId: data.userId,
                        mode: data.mode,
                        month: monthString,
                        year: yearMonthly,
                      },
                    },
                    update: {
                      score: data.score,
                      wpm: data.wpm,
                      raw: data.raw,
                      accuracy: data.accuracy,
                    },
                    create: {
                      userId: data.userId,
                      mode: data.mode,
                      month: monthString,
                      year: yearMonthly,
                      score: data.score,
                      wpm: data.wpm,
                      raw: data.raw,
                      accuracy: data.accuracy,
                    },
                  });
                  break;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error updating leaderboard from Redis:', error);
    }
  }

  async getDailyLeaderboard(
    date: string,
    mode: Mode,
    userId: string,
    page = 1,
    limit = 10,
    res: Response,
  ) {
    const leaderboardDate = new Date(date);
    if (isNaN(leaderboardDate.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use YYYY-MM-DD format.',
      );
    }

    // Retrieve total count for pagination
    const totalCount = await this.prismaService.leaderBoardDaily.count({
      where: {
        date: leaderboardDate,
        mode,
      },
    });
    const totalPages = Math.ceil((totalCount - 3) / limit);

    // Retrieve top 3 ranks
    const top3Ranks = await this.prismaService.leaderBoardDaily
      .findMany({
        where: {
          date: leaderboardDate,
          mode,
        },
        include: {
          user: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 3,
      })
      .then((ranks) =>
        ranks.map((rank) => ({ ...rank, score: rank.score.toString() })),
      );

    // Paginated results for the next ranks
    const skip = (page - 1) * limit + 3;
    const nextRanks = await this.prismaService.leaderBoardDaily
      .findMany({
        where: {
          date: leaderboardDate,
          mode,
        },
        orderBy: {
          score: 'desc',
        },
        include: {
          user: true,
        },
        skip,
        take: limit,
      })
      .then((ranks) =>
        ranks.map((rank) => ({ ...rank, score: rank.score.toString() })),
      );

    // Retrieve user rank
    const userRank = await this.getUserRank(
      'daily',
      leaderboardDate,
      mode,
      userId,
    );

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Daily Leaderboard fetched successfully',
      {
        top3Ranks,
        nextRanks,
        userRank,
        totalPages,
      },
      res,
    );
  }

  async getWeeklyLeaderboard(
    startDate: string,
    endDate: string,
    mode: Mode,
    userId: string,
    page = 1,
    limit = 10,
    res: Response,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new BadRequestException(
        'Invalid date format. Please use YYYY-MM-DD format.',
      );
    }

    // Retrieve total count for pagination
    const totalCount = await this.prismaService.leaderBoardWeekly.count({
      where: {
        startDate: { gte: start },
        endDate: { lte: end },
        mode,
      },
    });
    const totalPages = Math.ceil((totalCount - 3) / limit);

    // Retrieve top 3 ranks
    const top3Ranks = await this.prismaService.leaderBoardWeekly
      .findMany({
        where: {
          startDate: { gte: start },
          endDate: { lte: end },
          mode,
        },
        include: {
          user: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 3,
      })
      .then((ranks) =>
        ranks.map((rank) => ({ ...rank, score: rank.score.toString() })),
      );

    // Paginated results for the next ranks
    const skip = (page - 1) * limit + 3;
    const nextRanks = await this.prismaService.leaderBoardWeekly
      .findMany({
        where: {
          startDate: { gte: start },
          endDate: { lte: end },
          mode,
        },
        include: {
          user: true,
        },
        orderBy: {
          score: 'desc',
        },
        skip,
        take: limit,
      })
      .then((ranks) =>
        ranks.map((rank) => ({ ...rank, score: rank.score.toString() })),
      );

    // Retrieve user rank
    const userRank = await this.getUserRank('weekly', start, mode, userId, end);

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Weekly Leaderboard fetched successfully',
      {
        top3Ranks,
        nextRanks,
        userRank,
        totalPages,
      },
      res,
    );
  }

  async getMonthlyLeaderboard(
    month: Months,
    year: string,
    mode: Mode,
    userId: string,
    page = 1,
    limit = 10,
    res: Response,
  ) {
    const yearInt = parseInt(year, 10);

    if (isNaN(yearInt) || yearInt < 0) {
      throw new BadRequestException(
        'Invalid year format. Please use YYYY for the year.',
      );
    }

    if (!Object.values(Months).includes(month)) {
      throw new BadRequestException(
        'Invalid month. Please use a valid month name.',
      );
    }

    // Retrieve total count for pagination
    const totalCount = await this.prismaService.leaderBoardMonthly.count({
      where: {
        month,
        year: yearInt,
        mode,
      },
    });
    const totalPages = Math.ceil((totalCount - 3) / limit);

    // Retrieve top 3 ranks
    const top3Ranks = await this.prismaService.leaderBoardMonthly
      .findMany({
        where: {
          month,
          year: yearInt,
          mode,
        },
        include: {
          user: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 3,
      })
      .then((ranks) =>
        ranks.map((rank) => ({ ...rank, score: rank.score.toString() })),
      );

    // Paginated results for the next ranks
    const skip = (page - 1) * limit + 3;
    const nextRanks = await this.prismaService.leaderBoardMonthly
      .findMany({
        where: {
          month,
          year: yearInt,
          mode,
        },
        include: {
          user: true,
        },
        orderBy: {
          score: 'desc',
        },
        skip,
        take: limit,
      })
      .then((ranks) =>
        ranks.map((rank) => ({ ...rank, score: rank.score.toString() })),
      );

    // Retrieve user rank
    const userRank = await this.getUserRank(
      'monthly',
      yearInt,
      mode,
      userId,
      undefined,
      month,
    );

    return this.utils.sendHttpResponse(
      true,
      HttpStatus.OK,
      'Monthly Leaderboard fetched successfully',
      {
        top3Ranks,
        nextRanks,
        userRank,
        totalPages,
      },
      res,
    );
  }

  private async getUserRank(
    scope: 'daily' | 'weekly' | 'monthly',
    dateOrYear: Date | number,
    mode: Mode,
    userId: string,
    endDate?: Date,
    month?: Months,
  ) {
    let rank: number | null = -1;

    if (scope === 'daily') {
      const allRanks = await this.prismaService.leaderBoardDaily.findMany({
        where: {
          date: dateOrYear as Date,
          mode,
        },
        orderBy: {
          score: 'desc',
        },
      });
      rank = allRanks.findIndex((entry) => entry.userId === userId) + 1;
    } else if (scope === 'weekly') {
      const allRanks = await this.prismaService.leaderBoardWeekly.findMany({
        where: {
          startDate: { gte: dateOrYear as Date },
          endDate: { lte: endDate },
          mode,
        },
        orderBy: {
          score: 'desc',
        },
      });
      rank = allRanks.findIndex((entry) => entry.userId === userId) + 1;
    } else if (scope === 'monthly') {
      const allRanks = await this.prismaService.leaderBoardMonthly.findMany({
        where: {
          year: dateOrYear as number,
          month,
          mode,
        },
        orderBy: {
          score: 'desc',
        },
      });
      rank = allRanks.findIndex((entry) => entry.userId === userId) + 1;
    }

    return rank > 0 ? rank : null;
  }
}
