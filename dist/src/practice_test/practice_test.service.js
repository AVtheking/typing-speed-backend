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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeTestService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const utils_1 = require("../utils/utils");
let PracticeTestService = class PracticeTestService {
    constructor(prismaService, util) {
        this.prismaService = prismaService;
        this.util = util;
    }
    async createTest(createPracticeTestDto, res) {
        const { chapters, ...practiceTestData } = createPracticeTestDto;
        const { title, categoryId } = practiceTestData;
        const existingTest = await this.prismaService.practiceTest.findUnique({
            where: {
                title,
            },
        });
        if (existingTest) {
            throw new common_1.ConflictException('Lesson with this title already exists');
        }
        const category = await this.prismaService.category.findUnique({
            where: {
                id: categoryId,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.name !== practiceTestData.categoryName) {
            throw new common_1.ConflictException('Category name does not match');
        }
        const practiceTest = await this.prismaService.practiceTest.create({
            data: {
                ...practiceTestData,
                Chapter: {
                    create: chapters,
                },
            },
            include: {
                Chapter: true,
            },
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.CREATED, 'Practice Test created', practiceTest, res);
    }
    async updateTest(id, updatePracticeTestDto, res) {
        const { chapters, ...practiceTestData } = updatePracticeTestDto;
        let practiceTest = await this.prismaService.practiceTest.findUnique({
            where: {
                id: id,
            },
        });
        const { categoryId } = practiceTestData;
        const category = await this.prismaService.category.findUnique({
            where: {
                id: categoryId,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        if (category.name !== practiceTestData.categoryName) {
            throw new common_1.ConflictException('Category does not match');
        }
        if (!practiceTest) {
            throw new common_1.NotFoundException('Practice Test not found');
        }
        const existingTest = await this.prismaService.practiceTest.findUnique({
            where: {
                title: practiceTestData.title,
            },
        });
        if (existingTest && existingTest.id !== id) {
            throw new common_1.ConflictException('Lesson with this title already exists');
        }
        practiceTest = await this.prismaService.practiceTest.update({
            where: {
                id,
            },
            data: {
                ...practiceTestData,
                Chapter: {
                    create: chapters,
                },
            },
            include: {
                Chapter: true,
            },
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Practice Test updated', practiceTest, res);
    }
    async deleteTest(id, res) {
        const practiceTest = await this.prismaService.practiceTest.findUnique({
            where: {
                id,
            },
        });
        if (!practiceTest) {
            throw new common_1.NotFoundException('Practice Test not found');
        }
        await this.prismaService.practiceTest.delete({
            where: {
                id,
            },
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Practice Test deleted', null, res);
    }
    async getPracticeTestById(practiceTestId, userId, res) {
        const practiceTest = await this.prismaService.practiceTest.findUnique({
            where: {
                id: practiceTestId,
            },
            include: {
                Chapter: true,
            },
        });
        if (!practiceTest) {
            throw new common_1.NotFoundException('Practice Test not found');
        }
        await this.prismaService.user.update({
            where: {
                id: userId,
            },
            data: {
                lastTakenTestId: practiceTestId,
            },
        });
        const progressRecord = await this.prismaService.practiceTestProgress.findUnique({
            where: {
                userId_practiceTestId: {
                    userId,
                    practiceTestId,
                },
            },
        });
        const chapterProgress = await this.prismaService.userProgress.findMany({
            where: {
                userId: userId,
                chapter: {
                    practiceTestId: practiceTestId,
                },
            },
        });
        const progressMap = chapterProgress.reduce((acc, progress) => {
            acc[progress.chapterId] = progress.completed;
            return acc;
        }, {});
        const chapterWithProgress = practiceTest.Chapter.map((chapter) => ({
            id: chapter.id,
            title: chapter.title,
            embedCode: chapter.embedCode,
            layout: chapter.layout,
            completed: progressMap[chapter.id] || false,
        }));
        const response = {
            ...practiceTest,
            Chapter: chapterWithProgress,
            progress: progressRecord?.progress || 0,
            lastPlayedChapter: progressRecord?.lastPlayedChapterId || null,
        };
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Practice Test found', response, res);
    }
    async getLastTwoTests(userId, practiceTestId, res) {
        const lastTwoTests = await this.prismaService.userPracticeTestResult.findMany({
            where: {
                userId,
                practiceTestId,
            },
            orderBy: {
                completedAt: 'desc',
            },
            include: {
                UserKeyPressed: true,
            },
            take: 2,
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Last two result found', lastTwoTests, res);
    }
    async getAllTest(res, page, limit) {
        const skip = (page - 1) * limit;
        const [practiceTests, totalCount] = await Promise.all([
            this.prismaService.practiceTest.findMany({
                include: {
                    _count: {
                        select: {
                            Chapter: true,
                        },
                    },
                },
                skip: skip,
                take: limit,
            }),
            this.prismaService.practiceTest.count(),
        ]);
        const formattedPracticeTests = practiceTests.map((practiceTest) => ({
            ...practiceTest,
            totalChapters: practiceTest._count.Chapter,
        }));
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Practice Tests found', {
            practiceTests: formattedPracticeTests,
            pagination: {
                total: totalCount,
                page,
                totalPages: Math.ceil(totalCount / limit),
                limit,
            },
        }, res);
    }
    async trackPracticeTestProgress(practiceTestId, chapterId, completed, userId, res) {
        await this.prismaService.userProgress.upsert({
            where: {
                userId_chapterId: { userId, chapterId },
            },
            update: { completed },
            create: { userId, chapterId, completed },
        });
        const totalChapters = await this.prismaService.chapter.count({
            where: {
                practiceTestId,
            },
        });
        const completedChapters = await this.prismaService.userProgress.count({
            where: {
                userId,
                chapterId,
                completed: true,
            },
        });
        const progress = Math.floor(completedChapters / totalChapters);
        await this.prismaService.practiceTestProgress.upsert({
            where: {
                userId_practiceTestId: { userId, practiceTestId },
            },
            update: { progress, lastPlayedChapterId: chapterId },
            create: {
                userId,
                practiceTestId,
                progress,
                lastPlayedChapterId: chapterId,
            },
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Progress updated', {
            progress: progress * 100,
            lastPlayedChapterId: chapterId,
        }, res);
    }
    async saveResult(saveTestResultDto, userId, practiceTestId, res) {
        const { wpm, accuracy, time, raw, correct, incorrect, extras, missed, keyPressStats, } = saveTestResultDto;
        const practiceTest = await this.prismaService.practiceTest.findUnique({
            where: {
                id: practiceTestId,
            },
        });
        if (!practiceTest) {
            throw new common_1.NotFoundException('Practice Test not found');
        }
        const previousAttemptCount = await this.prismaService.userPracticeTestResult.count({
            where: {
                userId,
                practiceTestId,
            },
        });
        const currentAttempt = previousAttemptCount + 1;
        const result = await this.prismaService.userPracticeTestResult.create({
            data: {
                userId,
                practiceTestId,
                wpm,
                accuracy,
                time,
                raw,
                correct,
                incorrect,
                extras,
                missed,
            },
        });
        for (const stat of keyPressStats) {
            await this.prismaService.userKeyPressed.create({
                data: {
                    userPracticeTestResultId: result.id,
                    attempt: currentAttempt,
                    key: stat.key,
                    difficultyScore: stat.difficultyScore,
                },
            });
        }
        return this.util.sendHttpResponse(true, common_1.HttpStatus.CREATED, 'Result saved', result, res);
    }
    async createCategory(createCategoryDto, res) {
        const { name } = createCategoryDto;
        const existingCategory = await this.prismaService.category.findUnique({
            where: {
                name,
            },
        });
        if (existingCategory) {
            throw new common_1.ConflictException('Category already exists');
        }
        const category = await this.prismaService.category.create({
            data: createCategoryDto,
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.CREATED, 'Category created', category, res);
    }
    async deleteCategory(id, res) {
        const category = await this.prismaService.category.findUnique({
            where: {
                id,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        await this.prismaService.category.delete({
            where: {
                id,
            },
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Category deleted', null, res);
    }
    async updateCategory(id, data, res) {
        const category = await this.prismaService.category.findUnique({
            where: {
                id,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        const existingCategory = await this.prismaService.category.findUnique({
            where: {
                name: data.name,
            },
        });
        if (existingCategory && existingCategory.id !== id) {
            throw new common_1.ConflictException('Category already exists');
        }
        const updatedCategory = await this.prismaService.category.update({
            where: {
                id,
            },
            data,
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Category updated', updatedCategory, res);
    }
    async getCategoryByName(name, res) {
        const category = await this.prismaService.category.findUnique({
            where: {
                name,
            },
            include: {
                PracticeTest: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Category found', category, res);
    }
    async getCategoryById(id, res) {
        const category = await this.prismaService.category.findUnique({
            where: {
                id,
            },
            include: {
                PracticeTest: true,
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Category not found');
        }
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Category found', category, res);
    }
    async getAllCategories(res) {
        const categories = await this.prismaService.category.findMany({
            include: {
                _count: {
                    select: { PracticeTest: true },
                },
            },
        });
        const categoriesData = categories.map((category) => ({
            ...category,
            totalPracticeTests: category._count.PracticeTest,
        }));
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Categories found', { categories: categoriesData }, res);
    }
    async getPracticeTestByCategory(categoryId, userId, res) {
        const practiceTests = await this.prismaService.practiceTest.findMany({
            where: {
                categoryId,
            },
            include: {
                _count: {
                    select: {
                        Chapter: true,
                    },
                },
            },
        });
        if (!practiceTests || practiceTests.length === 0) {
            throw new common_1.NotFoundException('Practice Tests not found');
        }
        const progressRecord = await this.prismaService.practiceTestProgress.findMany({
            where: {
                userId,
                practiceTestId: {
                    in: practiceTests.map((test) => test.id),
                },
            },
        });
        const user = await this.prismaService.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                lastTakenTestId: true,
            },
        });
        const progressMap = progressRecord.reduce((acc, record) => {
            acc[record.practiceTestId] = record;
            return acc;
        }, {});
        const tests = practiceTests.map((test) => {
            const progressRecord = progressMap[test.id];
            const progress = progressRecord ? progressRecord.progress : 0;
            const lastPlayedChapterId = progressRecord
                ? progressRecord.lastPlayedChapterId
                : null;
            return {
                id: test.id,
                title: test.title,
                description: test.description,
                lastTakenTest: user?.lastTakenTestId === test.id,
                progress,
                lastPlayedChapter: lastPlayedChapterId,
            };
        });
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Practice Tests found', { practiceTests: tests }, res);
    }
    async getTestByCategoryName(category, userId, res) {
        console.log(category);
        const categoryData = await this.prismaService.category.findUnique({
            where: {
                name: category,
            },
        });
        if (!categoryData) {
            throw new common_1.NotFoundException('Category not found');
        }
        const response = await this.getPracticeTestByCategory(categoryData.id, userId, res);
        return response;
    }
};
exports.PracticeTestService = PracticeTestService;
exports.PracticeTestService = PracticeTestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_1.Utils])
], PracticeTestService);
//# sourceMappingURL=practice_test.service.js.map