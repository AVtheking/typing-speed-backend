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
exports.PracticeTestController = void 0;
const common_1 = require("@nestjs/common");
const practice_test_service_1 = require("./practice_test.service");
const create_practice_test_dto_1 = require("./dto/create-practice_test.dto");
const guards_1 = require("../guards");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
let PracticeTestController = class PracticeTestController {
    constructor(practiceTestService) {
        this.practiceTestService = practiceTestService;
    }
    create(createPracticeTestDto, res) {
        return this.practiceTestService.createTest(createPracticeTestDto, res);
    }
    async getAllTest(page = 1, limit = 10, res) {
        page = page > 0 ? page : 1;
        limit = limit > 0 ? limit : 10;
        return this.practiceTestService.getAllTest(res, page, limit);
    }
    async getTestByLevel(level, res) {
        return this.practiceTestService.getTestByDifficulty(level, res);
    }
};
exports.PracticeTestController = PracticeTestController;
__decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Post)('/admin/createPracticeTest'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiConsumes)('application/json'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiBody)({
        type: create_practice_test_dto_1.CreatePracticeTestDto,
        description: 'Practice test data to create a new practice test',
    }),
    (0, swagger_1.ApiResponse)({
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
                    titleAndDescription: 'Typing Speed Test - A test to measure your typing speed.',
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
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Error creating practice test',
        schema: {
            example: {
                statusCode: 400,
                message: 'Error creating practice test',
                error: 'Detailed error message here',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'User not authorized.',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_practice_test_dto_1.CreatePracticeTestDto, Object]),
    __metadata("design:returntype", void 0)
], PracticeTestController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiTags)('Practice Test'),
    (0, common_1.Get)('practiceTest'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getAllTest", null);
__decorate([
    (0, swagger_1.ApiTags)('Practice Test'),
    (0, common_1.Get)('practiceTest/:level'),
    __param(0, (0, common_1.Param)('level')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getTestByLevel", null);
exports.PracticeTestController = PracticeTestController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [practice_test_service_1.PracticeTestService])
], PracticeTestController);
//# sourceMappingURL=practice_test.controller.js.map