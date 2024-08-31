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
    async create(createPracticeTestDto, res) {
        const { chapters, ...practiceTestData } = createPracticeTestDto;
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
};
exports.PracticeTestService = PracticeTestService;
exports.PracticeTestService = PracticeTestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        utils_1.Utils])
], PracticeTestService);
//# sourceMappingURL=practice_test.service.js.map