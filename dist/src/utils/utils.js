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
exports.Utils = exports.ScoreScope = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const bcrypt = require("bcrypt");
const AWS = require("aws-sdk");
const constants_1 = require("../auth/constants");
const response_user_dto_1 = require("../auth/dto/response-user.dto");
const admin_login_dto_1 = require("../auth/dto/admin-login.dto");
const config_1 = require("../config");
const client_1 = require("@prisma/client");
const save_test_result_dto_1 = require("../users/dto/save-test-result.dto");
var ScoreScope;
(function (ScoreScope) {
    ScoreScope["DAY"] = "day";
    ScoreScope["WEEK"] = "week";
    ScoreScope["MONTH"] = "month";
})(ScoreScope || (exports.ScoreScope = ScoreScope = {}));
const MILLISECONDS_IN_DAY = 86400000;
const MILLISECONDS_IN_WEEK = MILLISECONDS_IN_DAY * 7;
let Utils = class Utils {
    constructor() {
        this.AWS_S3_BUCKET_NAME = config_1.Env.AWS_BUCKET_NAME;
        this.s3 = new AWS.S3({
            accessKeyId: config_1.Env.AWS_ACCESS_KEY,
            secretAccessKey: config_1.Env.AWS_SECRET_KEY,
            region: config_1.Env.AWS_REGION,
        });
    }
    async uploadFile(file) {
        console.log(file);
        const { originalname } = file;
        return await this.s3_upload(file.buffer, this.AWS_S3_BUCKET_NAME, originalname, file.mimetype);
    }
    async s3_upload(file, bucket, name, mimetype) {
        const params = {
            Bucket: bucket,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: 'ap-south-1',
            },
        };
        try {
            const s3Response = await this.s3.upload(params).promise();
            return s3Response;
        }
        catch (e) {
            console.log(e);
        }
    }
    async sendHttpResponse(success, statusCode, message, data, res) {
        return res.status(statusCode).json({
            success,
            message,
            data: {
                ...data,
            },
        });
    }
    randomPassword() {
        let password = '';
        for (let i = 0; i < 8; i++) {
            password += constants_1.charsLowercase.charAt(Math.floor(Math.random() * constants_1.charsLowercase.length));
            password += constants_1.charsUppercase.charAt(Math.floor(Math.random() * constants_1.charsUppercase.length));
            password += constants_1.charsSpecial.charAt(Math.floor(Math.random() * constants_1.charsSpecial.length));
            password += constants_1.charsDigits.charAt(Math.floor(Math.random() * constants_1.charsDigits.length));
        }
        return password;
    }
    randomInteger(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    userResponse(user) {
        const userResponse = (0, class_transformer_1.plainToInstance)(response_user_dto_1.UserDto, {
            ...user,
        });
        return userResponse;
    }
    adminResponse(admin) {
        const adminResponse = (0, class_transformer_1.plainToInstance)(admin_login_dto_1.AdminUserDto, {
            ...admin,
        });
        return adminResponse;
    }
    async hashPassword(password) {
        const saltOrRounds = 10;
        return bcrypt.hash(password, saltOrRounds);
    }
    async comparePassword(password, hashPassword) {
        try {
            return bcrypt.compare(password, hashPassword);
        }
        catch (error) {
            console.error('Error comparing password:', error);
            return false;
        }
    }
    calculateScore(wpm, acc, timestamp, scope) {
        const normalizedWpm = Math.floor(wpm * 100);
        const normalizedAcc = Math.floor(acc * 100);
        const padAmount = 100000;
        const firstPart = (padAmount + normalizedWpm) * padAmount;
        const secondPart = (firstPart + normalizedAcc) * padAmount;
        let remainingTimeInScope;
        const date = new Date(timestamp);
        if (scope === ScoreScope.DAY) {
            const currentDayTimeMilliseconds = timestamp - (timestamp % MILLISECONDS_IN_DAY);
            const todayMilliseconds = timestamp - currentDayTimeMilliseconds;
            remainingTimeInScope = MILLISECONDS_IN_DAY - todayMilliseconds;
        }
        else if (scope === ScoreScope.WEEK) {
            const startOfWeek = timestamp -
                (date.getDay() * MILLISECONDS_IN_DAY +
                    date.getHours() * 3600000 +
                    date.getMinutes() * 60000 +
                    date.getSeconds() * 1000);
            const elapsedMillisecondsInWeek = timestamp - startOfWeek;
            remainingTimeInScope = MILLISECONDS_IN_WEEK - elapsedMillisecondsInWeek;
        }
        else if (scope === ScoreScope.MONTH) {
            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
            const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1).getTime();
            const millisecondsInMonth = nextMonth - startOfMonth;
            const elapsedMillisecondsInMonth = timestamp - startOfMonth;
            remainingTimeInScope = millisecondsInMonth - elapsedMillisecondsInMonth;
        }
        return secondPart + Math.floor(remainingTimeInScope / 1000);
    }
    getWeekKey(date) {
        const year = date.getFullYear();
        const firstDayOfYear = new Date(year, 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return `${year}-W${weekNumber}`;
    }
    mapDtoModeToPrismaMode(mode) {
        switch (mode) {
            case save_test_result_dto_1.Mode.FifteenSeconds:
                return client_1.Mode.FifteenSeconds;
            case save_test_result_dto_1.Mode.ThirtySeconds:
                return client_1.Mode.ThirtySeconds;
            case save_test_result_dto_1.Mode.SixtySeconds:
                return client_1.Mode.SixtySeconds;
            default:
                throw new Error(`Invalid mode value: ${mode}`);
        }
    }
    getStartAndEndOfWeek(year, week) {
        const firstDayOfYear = new Date(year, 0, 1);
        const dayOffset = (firstDayOfYear.getDay() + 6) % 7;
        const firstThursday = new Date(firstDayOfYear.getTime() + (3 - dayOffset) * MILLISECONDS_IN_DAY);
        const startDate = new Date(firstThursday.getTime() + (week - 1) * 7 * MILLISECONDS_IN_DAY);
        const endDate = new Date(startDate.getTime() + 6 * MILLISECONDS_IN_DAY);
        return { startDate, endDate };
    }
    monthFromMonthNumber(month) {
        switch (month) {
            case 1:
                return 'January';
            case 2:
                return 'February';
            case 3:
                return 'March';
            case 4:
                return 'April';
            case 5:
                return 'May';
            case 6:
                return 'June';
            case 7:
                return 'July';
            case 8:
                return 'August';
            case 9:
                return 'September';
            case 10:
                return 'October';
            case 11:
                return 'November';
            case 12:
                return 'December';
            default:
                throw new Error(`Invalid month number: ${month}`);
        }
    }
};
exports.Utils = Utils;
exports.Utils = Utils = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Utils);
//# sourceMappingURL=utils.js.map