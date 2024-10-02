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
exports.SaveTestResultDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class SaveTestResultDto {
}
exports.SaveTestResultDto = SaveTestResultDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'ID of the practice test being submitted',
        example: 'test12345',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], SaveTestResultDto.prototype, "practiceTestId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Words per minute (WPM) of the user',
        example: 48,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "wpm", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Typing accuracy in percentage',
        example: 99,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "accuracy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Time taken for the test in seconds',
        example: 15,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "time", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Raw typing speed',
        example: 15,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "raw", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of correct characters typed',
        example: 50,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "correct", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of incorrect characters typed',
        example: 2,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "incorrect", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of extra characters typed',
        example: 4,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "extras", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Number of characters missed',
        example: 0,
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], SaveTestResultDto.prototype, "missed", void 0);
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
    __metadata("design:type", Array)
], SaveTestResultDto.prototype, "keyPressStats", void 0);
//# sourceMappingURL=save-result.dto.js.map