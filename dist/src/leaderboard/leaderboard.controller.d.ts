import { LeaderboardService } from './leaderboard.service';
import { Response } from 'express';
import { Months, Mode } from '@prisma/client';
export declare class LeaderboardController {
    private readonly leaderboardService;
    constructor(leaderboardService: LeaderboardService);
    getDailyLeaderboard(date: string, mode: Mode, page: number | undefined, limit: number | undefined, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    getWeeklyLeaderboard(startDate: string, endDate: string, mode: Mode, page: number | undefined, limit: number | undefined, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
    getMonthlyLeaderboard(month: Months, year: string, mode: Mode, page: number | undefined, limit: number | undefined, res: Response, req: any): Promise<Response<any, Record<string, any>>>;
}
