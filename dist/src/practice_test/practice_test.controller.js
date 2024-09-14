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
const create_category_dto_1 = require("./dto/create-category.dto");
const update_practice_test_dto_1 = require("./dto/update-practice_test.dto");
let PracticeTestController = class PracticeTestController {
    constructor(practiceTestService) {
        this.practiceTestService = practiceTestService;
    }
    createCategory(createCategoryDto, res) {
        return this.practiceTestService.createCategory(createCategoryDto, res);
    }
    async getAllCategory(res) {
        return this.practiceTestService.getAllCategories(res);
    }
    async getCategoryById(id, res) {
        return this.practiceTestService.getCategoryById(id, res);
    }
    async getCategoryByName(name, res) {
        return this.practiceTestService.getCategoryByName(name, res);
    }
    updateCategory(createCategoryDto, id, res) {
        return this.practiceTestService.updateCategory(id, createCategoryDto, res);
    }
    async deleteCategory(id, res) {
        return this.practiceTestService.deleteCategory(id, res);
    }
    createTest(createPracticeTestDto, res) {
        return this.practiceTestService.createTest(createPracticeTestDto, res);
    }
    updatePracticeTest(updatePracticeTestDto, id, res) {
        return this.practiceTestService.updateTest(id, updatePracticeTestDto, res);
    }
    async deletePracticeTest(id, res) {
        return this.practiceTestService.deleteTest(id, res);
    }
    async getAllTest(page = 1, limit = 10, res) {
        page = page > 0 ? page : 1;
        limit = limit > 0 ? limit : 10;
        return this.practiceTestService.getAllTest(res, page, limit);
    }
    async getTestById(id, res, req) {
        const userId = req.user;
        return this.practiceTestService.getPracticeTestById(id, userId, res);
    }
    async getTestByCategory(categoryId, res, req) {
        const userId = req.user;
        return this.practiceTestService.getPracticeTestByCategory(categoryId, userId, res);
    }
    async getTestByCategoryName(category, res) {
        return this.practiceTestService.getTestByCategoryName(category, res);
    }
    async updateChapterCompleted(practiceTestId, chapterId, completed, req, res) {
        const userId = req.user;
        return this.practiceTestService.trackPracticeTestProgress(practiceTestId, chapterId, completed, userId, res);
    }
};
exports.PracticeTestController = PracticeTestController;
__decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Post)('/admin/createCategory'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiBody)({
        type: create_category_dto_1.CreateCategoryDto,
        description: 'Practice test data to create a new category ',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, Object]),
    __metadata("design:returntype", void 0)
], PracticeTestController.prototype, "createCategory", null);
__decorate([
    (0, swagger_1.ApiTags)('Category'),
    (0, common_1.Get)('/allCategories'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getAllCategory", null);
__decorate([
    (0, swagger_1.ApiTags)('Category'),
    (0, common_1.Get)('category/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getCategoryById", null);
__decorate([
    (0, swagger_1.ApiTags)('Category'),
    (0, common_1.Get)('category'),
    __param(0, (0, common_1.Query)('name')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getCategoryByName", null);
__decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)('/admin/updateCategory/:id'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiBody)({
        type: create_category_dto_1.CreateCategoryDto,
        description: 'Practice test data to update a category',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_category_dto_1.CreateCategoryDto, String, Object]),
    __metadata("design:returntype", void 0)
], PracticeTestController.prototype, "updateCategory", null);
__decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Delete)('/admin/deleteCategory/:id'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "deleteCategory", null);
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
], PracticeTestController.prototype, "createTest", null);
__decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, common_1.Put)('/admin/updatePracticeTest/:id'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    (0, swagger_1.ApiBody)({
        type: update_practice_test_dto_1.UpdatePracticeTestDto,
        description: 'Practice test data to update a  practice test',
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_practice_test_dto_1.UpdatePracticeTestDto, String, Object]),
    __metadata("design:returntype", void 0)
], PracticeTestController.prototype, "updatePracticeTest", null);
__decorate([
    (0, common_1.Delete)('/admin/deletePracticeTest/:id'),
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "deletePracticeTest", null);
__decorate([
    (0, swagger_1.ApiTags)('Practice Test'),
    (0, common_1.Get)('practiceTest/all'),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getAllTest", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.Get)('practiceTest/'),
    (0, swagger_1.ApiTags)('Practice Test'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getTestById", null);
__decorate([
    (0, swagger_1.ApiTags)('Practice Test'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, common_1.Get)('practiceTest/:categoryId'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __param(0, (0, common_1.Param)('categoryId')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getTestByCategory", null);
__decorate([
    (0, swagger_1.ApiTags)('Practice Test'),
    (0, common_1.Get)('practiceTest/category'),
    __param(0, (0, common_1.Query)('category')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "getTestByCategoryName", null);
__decorate([
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiTags)('Practice Test'),
    (0, common_1.Put)('practiceTest/trackProgress/'),
    (0, swagger_1.ApiBearerAuth)('JWT'),
    __param(0, (0, common_1.Query)('practiceTestId')),
    __param(1, (0, common_1.Query)('chapterId')),
    __param(2, (0, common_1.Query)('completed')),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Boolean, Object, Object]),
    __metadata("design:returntype", Promise)
], PracticeTestController.prototype, "updateChapterCompleted", null);
exports.PracticeTestController = PracticeTestController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [practice_test_service_1.PracticeTestService])
], PracticeTestController);
//# sourceMappingURL=practice_test.controller.js.map