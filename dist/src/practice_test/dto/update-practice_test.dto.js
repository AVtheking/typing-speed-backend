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
exports.UpdatePracticeTestDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const create_practice_test_dto_1 = require("./create-practice_test.dto");
class UpdatePracticeTestDto extends (0, swagger_1.PartialType)(create_practice_test_dto_1.CreatePracticeTestDto) {
}
exports.UpdatePracticeTestDto = UpdatePracticeTestDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Title of the practice test',
        example: 'Typing Speed Test',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePracticeTestDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Description of the practice test',
        example: 'A test to measure your typing speed.',
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePracticeTestDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Combined title and description',
        example: 'Typing Speed Test - A test to measure your typing speed.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], UpdatePracticeTestDto.prototype, "titleAndDescription", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meta title for SEO',
        example: 'Typing Test',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], UpdatePracticeTestDto.prototype, "metaTitle", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Meta description for SEO',
        example: 'Measure your typing speed with this practice test.',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], UpdatePracticeTestDto.prototype, "metaDescription", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], UpdatePracticeTestDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Category name of the practice test',
        example: 'Typing Basics',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsDefined)(),
    __metadata("design:type", String)
], UpdatePracticeTestDto.prototype, "categoryName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Video tag for the practice test',
        example: 'video',
        required: false,
    }),
    __metadata("design:type", Object)
], UpdatePracticeTestDto.prototype, "videoTag", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'List of chapters included in the practice test',
        type: [create_practice_test_dto_1.CreateChapterDto],
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_practice_test_dto_1.CreateChapterDto),
    __metadata("design:type", Array)
], UpdatePracticeTestDto.prototype, "chapters", void 0);
//# sourceMappingURL=update-practice_test.dto.js.map