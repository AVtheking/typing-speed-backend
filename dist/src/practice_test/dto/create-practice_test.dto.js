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
exports.CreatePracticeTestDto = exports.CreateChapterDto = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var Difficulty;
(function (Difficulty) {
    Difficulty["Basic"] = "Basic";
    Difficulty["Beginner"] = "Beginner";
    Difficulty["Intermediate"] = "Intermediate";
    Difficulty["Advanced"] = "Advanced";
})(Difficulty || (Difficulty = {}));
var Layout;
(function (Layout) {
    Layout["BoxLayout"] = "BoxLayout";
    Layout["LineLayout"] = "LineLayout";
})(Layout || (Layout = {}));
class CreateChapterDto {
}
exports.CreateChapterDto = CreateChapterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the chapter',
        example: 'Chapter 1: Introduction',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], CreateChapterDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the chapter',
        example: 'This chapter covers the basics of typing.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], CreateChapterDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Layout type for the chapter',
        enum: Layout,
        example: Layout.BoxLayout,
    }),
    (0, class_validator_1.IsEnum)(Layout),
    __metadata("design:type", String)
], CreateChapterDto.prototype, "layout", void 0);
class CreatePracticeTestDto {
}
exports.CreatePracticeTestDto = CreatePracticeTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the practice test',
        example: 'Typing Speed Test',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePracticeTestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the practice test',
        example: 'A test to measure your typing speed.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePracticeTestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Combined title and description',
        example: 'Typing Speed Test - A test to measure your typing speed.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], CreatePracticeTestDto.prototype, "titleAndDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meta title for SEO',
        example: 'Typing Test',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], CreatePracticeTestDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meta description for SEO',
        example: 'Measure your typing speed with this practice test.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], CreatePracticeTestDto.prototype, "metaDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Difficulty level of the practice test',
        enum: Difficulty,
        example: Difficulty.Beginner,
    }),
    (0, class_validator_1.IsEnum)(Difficulty),
    __metadata("design:type", String)
], CreatePracticeTestDto.prototype, "difficulty", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of chapters included in the practice test',
        type: [CreateChapterDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateChapterDto),
    __metadata("design:type", Array)
], CreatePracticeTestDto.prototype, "chapters", void 0);
//# sourceMappingURL=create-practice_test.dto.js.map