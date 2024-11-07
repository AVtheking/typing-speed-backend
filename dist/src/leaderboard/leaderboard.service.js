"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_1 = require("../utils/utils");
const save_test_result_dto_1 = require("../users/dto/save-test-result.dto");
const redis_module_1 = require("../redis/redis.module");
const ioredis_1 = require("ioredis");
let LeaderboardService = class LeaderboardService {
    constructor(redisClient, prismaService, utils) {
        this.redisClient = redisClient;
        this.prismaService = prismaService;
        this.utils = utils;
    }
    async updateLeaderboardFromRedis() {
        const modes = [
            save_test_result_dto_1.Mode.FifteenSeconds,
            save_test_result_dto_1.Mode.ThirtySeconds,
            save_test_result_dto_1.Mode.SixtySeconds,
        ];
        const leaderboardTypes = ['daily', 'weekly', 'monthly'];
        try {
            for (const mode of modes) {
                for (const type of leaderboardTypes) {
                    const redisKeyPattern = `leaderboard:${type}:${mode}:*`;
                    const keys = await this.redisClient.keys(redisKeyPattern);
                    const sortedSetKeys = keys.filter((key) => key.split(':').length === 4);
                    for (const key of sortedSetKeys) {
                        const dateIdentifier = key.split(':').pop();
                        if (!dateIdentifier) {
                            continue;
                        }
                        const leaderboardEntries = await this.redisClient.zrevrange(key, 0, -1, 'WITHSCORES');
                        for (let i = 0; i < leaderboardEntries.length; i += 2) {
                            const userId = leaderboardEntries[i];
                            console.log(userId);
                            const score = parseInt(leaderboardEntries[i + 1]);
                            const userHashKey = `${key}:${userId}`;
                            const wpm = parseInt((await this.redisClient.hget(userHashKey, 'wpm')) || '0');
                            const raw = parseInt((await this.redisClient.hget(userHashKey, 'raw')) || '0');
                            const accuracy = parseInt((await this.redisClient.hget(userHashKey, 'accuracy')) || '0');
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
                                    const { startDate, endDate } = this.utils.getStartAndEndOfWeek(year, week);
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
                                    const [yearStrMonthly, monthStrMonthly] = dateIdentifier.split('-');
                                    const yearMonthly = parseInt(yearStrMonthly, 10);
                                    const month = parseInt(monthStrMonthly, 10);
                                    const monthString = this.utils.monthFromMonthNumber(month);
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
        }
        catch (error) {
            console.error('Error updating leaderboard from Redis:', error);
        }
    }
    async getDailyLeaderboard(date, mode, userId, page = 1, limit = 10, res) {
        const leaderboardDate = new Date(date);
        if (isNaN(leaderboardDate.getTime())) {
            throw new common_1.BadRequestException('Invalid date format. Please use YYYY-MM-DD format.');
        }
        const totalCount = await this.prismaService.leaderBoardDaily.count({
            where: {
                date: leaderboardDate,
                mode,
            },
        });
        const totalPages = Math.ceil((totalCount - 3) / limit);
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
            .then((ranks) => ranks.map((rank) => ({ ...rank, score: rank.score.toString() })));
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
            .then((ranks) => ranks.map((rank) => ({ ...rank, score: rank.score.toString() })));
        const userRank = await this.getUserRank('daily', leaderboardDate, mode, userId);
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Daily Leaderboard fetched successfully', {
            top3Ranks,
            nextRanks,
            userRank,
            totalPages,
        }, res);
    }
    async getWeeklyLeaderboard(startDate, endDate, mode, userId, page = 1, limit = 10, res) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new common_1.BadRequestException('Invalid date format. Please use YYYY-MM-DD format.');
        }
        const totalCount = await this.prismaService.leaderBoardWeekly.count({
            where: {
                startDate: { gte: start },
                endDate: { lte: end },
                mode,
            },
        });
        const totalPages = Math.ceil((totalCount - 3) / limit);
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
            .then((ranks) => ranks.map((rank) => ({ ...rank, score: rank.score.toString() })));
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
            .then((ranks) => ranks.map((rank) => ({ ...rank, score: rank.score.toString() })));
        const userRank = await this.getUserRank('weekly', start, mode, userId, end);
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Weekly Leaderboard fetched successfully', {
            top3Ranks,
            nextRanks,
            userRank,
            totalPages,
        }, res);
    }
    async getMonthlyLeaderboard(month, year, mode, userId, page = 1, limit = 10, res) {
        const yearInt = parseInt(year, 10);
        if (isNaN(yearInt) || yearInt < 0) {
            throw new common_1.BadRequestException('Invalid year format. Please use YYYY for the year.');
        }
        if (!Object.values(client_1.Months).includes(month)) {
            throw new common_1.BadRequestException('Invalid month. Please use a valid month name.');
        }
        const totalCount = await this.prismaService.leaderBoardMonthly.count({
            where: {
                month,
                year: yearInt,
                mode,
            },
        });
        const totalPages = Math.ceil((totalCount - 3) / limit);
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
            .then((ranks) => ranks.map((rank) => ({ ...rank, score: rank.score.toString() })));
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
            .then((ranks) => ranks.map((rank) => ({ ...rank, score: rank.score.toString() })));
        const userRank = await this.getUserRank('monthly', yearInt, mode, userId, undefined, month);
        return this.utils.sendHttpResponse(true, common_1.HttpStatus.OK, 'Monthly Leaderboard fetched successfully', {
            top3Ranks,
            nextRanks,
            userRank,
            totalPages,
        }, res);
    }
    async getUserRank(scope, dateOrYear, mode, userId, endDate, month) {
        let rank = -1;
        if (scope === 'daily') {
            const allRanks = await this.prismaService.leaderBoardDaily.findMany({
                where: {
                    date: dateOrYear,
                    mode,
                },
                orderBy: {
                    score: 'desc',
                },
            });
            rank = allRanks.findIndex((entry) => entry.userId === userId) + 1;
        }
        else if (scope === 'weekly') {
            const allRanks = await this.prismaService.leaderBoardWeekly.findMany({
                where: {
                    startDate: { gte: dateOrYear },
                    endDate: { lte: endDate },
                    mode,
                },
                orderBy: {
                    score: 'desc',
                },
            });
            rank = allRanks.findIndex((entry) => entry.userId === userId) + 1;
        }
        else if (scope === 'monthly') {
            const allRanks = await this.prismaService.leaderBoardMonthly.findMany({
                where: {
                    year: dateOrYear,
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
};
exports.LeaderboardService = LeaderboardService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_10_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LeaderboardService.prototype, "updateLeaderboardFromRedis", null);
exports.LeaderboardService = LeaderboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT_TOKEN)),
    __metadata("design:paramtypes", [ioredis_1.default,
        prisma_service_1.PrismaService,
        utils_1.Utils])
], LeaderboardService);
//# sourceMappingURL=leaderboard.service.js.map