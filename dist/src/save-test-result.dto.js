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
exports.SaveResultDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SaveResultDto {
}
exports.SaveResultDto = SaveResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Words per minute (WPM) of the user',
        example: 48,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "wpm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Typing accuracy in percentage',
        example: 99,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "accuracy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time taken for the test in seconds',
        example: 15,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raw typing speed',
        example: 15,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "raw", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of correct characters typed',
        example: 50,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "correct", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of incorrect characters typed',
        example: 2,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "incorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of extra characters typed',
        example: 4,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "extras", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of characters missed',
        example: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveResultDto.prototype, "missed", void 0);
//# sourceMappingURL=save-test-result.dto.js.map