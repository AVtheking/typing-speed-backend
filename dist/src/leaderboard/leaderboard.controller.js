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
exports.LeaderboardController = void 0;
const common_1 = require("@nestjs/common");
const leaderboard_service_1 = require("./leaderboard.service");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const guards_1 = require("../guards");
let LeaderboardController = class LeaderboardController {
    constructor(leaderboardService) {
        this.leaderboardService = leaderboardService;
    }
    async getDailyLeaderboard(date, mode, page = 1, limit = 10, res, req) {
        const userId = req.user;
        return this.leaderboardService.getDailyLeaderboard(date, mode, userId, page, limit, res);
    }
    async getWeeklyLeaderboard(startDate, endDate, mode, page = 1, limit = 10, res, req) {
        const userId = req.user;
        return this.leaderboardService.getWeeklyLeaderboard(startDate, endDate, mode, userId, page, limit, res);
    }
    async getMonthlyLeaderboard(month, year, mode, page = 1, limit = 10, res, req) {
        const userId = req.user;
        return this.leaderboardService.getMonthlyLeaderboard(month, year, mode, userId, page, limit, res);
    }
};
exports.LeaderboardController = LeaderboardController;
__decorate([
    (0, common_1.Get)('daily'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve daily leaderboard',
        description: 'Fetch the top 3 and paginated next ranks for the daily leaderboard for a specific date and mode.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'date',
        type: String,
        description: 'Date in YYYY-MM-DD format',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'mode',
        enum: client_1.Mode,
        description: 'Mode of the test (e.g., "15s", "30s", "60s")',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        type: Number,
        required: false,
        description: 'Page number for pagination, defaults to 1',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of items per page, defaults to 10',
    }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Query)('mode')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Res)()),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getDailyLeaderboard", null);
__decorate([
    (0, common_1.Get)('weekly'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve weekly leaderboard',
        description: 'Fetch the top 3 and paginated next ranks for the weekly leaderboard within a date range and specific mode.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'startDate',
        type: String,
        description: 'Start date in YYYY-MM-DD format',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'endDate',
        type: String,
        description: 'End date in YYYY-MM-DD format',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'mode',
        enum: client_1.Mode,
        description: 'Mode of the test (e.g., "15s", "30s", "60s")',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        type: Number,
        required: false,
        description: 'Page number for pagination, defaults to 1',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of items per page, defaults to 10',
    }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Query)('mode')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Res)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getWeeklyLeaderboard", null);
__decorate([
    (0, common_1.Get)('monthly'),
    (0, swagger_1.ApiOperation)({
        summary: 'Retrieve monthly leaderboard',
        description: 'Fetch the top 3 and paginated next ranks for the monthly leaderboard within a specified month, year, and mode.',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'month',
        enum: client_1.Months,
        description: 'Month as a valid month enum (e.g., "January")',
    }),
    (0, swagger_1.ApiQuery)({ name: 'year', type: String, description: 'Year as YYYY' }),
    (0, swagger_1.ApiQuery)({
        name: 'mode',
        enum: client_1.Mode,
        description: 'Mode of the test (e.g., "15s", "30s", "60s")',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'page',
        type: Number,
        required: false,
        description: 'Page number for pagination, defaults to 1',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'limit',
        type: Number,
        required: false,
        description: 'Number of items per page, defaults to 10',
    }),
    __param(0, (0, common_1.Query)('month')),
    __param(1, (0, common_1.Query)('year')),
    __param(2, (0, common_1.Query)('mode')),
    __param(3, (0, common_1.Query)('page')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Res)()),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], LeaderboardController.prototype, "getMonthlyLeaderboard", null);
exports.LeaderboardController = LeaderboardController = __decorate([
    (0, swagger_1.ApiTags)('Leaderboard'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, common_1.Controller)('leaderboard'),
    __metadata("design:paramtypes", [leaderboard_service_1.LeaderboardService])
], LeaderboardController);
//# sourceMappingURL=leaderboard.controller.js.map