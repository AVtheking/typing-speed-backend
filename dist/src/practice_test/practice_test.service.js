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
    async getPracticeTestById(id, res) {
        const practiceTest = await this.prismaService.practiceTest.findUnique({
            where: {
                id,
            },
            include: {
                Chapter: true,
            },
        });
        if (!practiceTest) {
            throw new common_1.NotFoundException('Practice Test not found');
        }
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Practice Test found', practiceTest, res);
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
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Categories found', categories.map((category) => ({
            ...category,
            totalPracticeTests: category._count.PracticeTest,
        })), res);
    }
    async getPracticeTestByCategory(categoryId, res) {
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
        if (!practiceTests) {
            throw new common_1.NotFoundException('Practice Tests not found');
        }
        return this.util.sendHttpResponse(true, common_1.HttpStatus.OK, 'Practice Tests found', practiceTests, res);
    }
};
exports.PracticeTestService = PracticeTestService;
exports.PracticeTestService = PracticeTestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_1.Utils])
], PracticeTestService);
//# sourceMappingURL=practice_test.service.js.map