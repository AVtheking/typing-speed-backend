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
let PracticeTestController = class PracticeTestController {
    constructor(practiceTestService) {
        this.practiceTestService = practiceTestService;
    }
    create(createPracticeTestDto) {
        return this.practiceTestService.create(createPracticeTestDto);
    }
};
exports.PracticeTestController = PracticeTestController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(guards_1.AdminGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_practice_test_dto_1.CreatePracticeTestDto]),
    __metadata("design:returntype", void 0)
], PracticeTestController.prototype, "create", null);
exports.PracticeTestController = PracticeTestController = __decorate([
    (0, common_1.Controller)('practice-test'),
    __metadata("design:paramtypes", [practice_test_service_1.PracticeTestService])
], PracticeTestController);
//# sourceMappingURL=practice_test.controller.js.map