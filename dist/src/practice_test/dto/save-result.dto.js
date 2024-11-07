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
exports.SavePracticeTestResultDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const save_test_result_dto_1 = require("../../save-test-result.dto");
class SavePracticeTestResultDto extends save_test_result_dto_1.SaveResultDto {
}
exports.SavePracticeTestResultDto = SavePracticeTestResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time taken for the test in seconds',
        example: 15,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SavePracticeTestResultDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of key press stats with difficulty scores',
        type: Array,
        example: [
            { key: 'A', difficultyScore: 10 },
            { key: 'S', difficultyScore: 15 },
        ],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    __metadata("design:type", Array)
], SavePracticeTestResultDto.prototype, "keyPressStats", void 0);
//# sourceMappingURL=save-result.dto.js.map