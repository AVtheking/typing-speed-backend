import { Months, Mode } from '@prisma/client';
import { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import Redis from 'ioredis';
export declare class LeaderboardService {
    private readonly redisClient;
    private prismaService;
    private utils;
    constructor(redisClient: Redis, prismaService: PrismaService, utils: Utils);
    updateLeaderboardFromRedis(): Promise<void>;
    getDailyLeaderboard(date: string, mode: Mode, userId: string, page: number | undefined, limit: number | undefined, res: Response): Promise<Response<any, Record<string, any>>>;
    getWeeklyLeaderboard(startDate: string, endDate: string, mode: Mode, userId: string, page: number | undefined, limit: number | undefined, res: Response): Promise<Response<any, Record<string, any>>>;
    getMonthlyLeaderboard(month: Months, year: string, mode: Mode, userId: string, page: number | undefined, limit: number | undefined, res: Response): Promise<Response<any, Record<string, any>>>;
    private getUserRank;
}
