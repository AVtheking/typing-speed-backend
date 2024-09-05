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
exports.Utils = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const bcrypt = require("bcrypt");
const constants_1 = require("../auth/constants");
const response_user_dto_1 = require("../auth/dto/response-user.dto");
const admin_login_dto_1 = require("../auth/dto/admin-login.dto");
let Utils = class Utils {
    constructor() { }
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
};
exports.Utils = Utils;
exports.Utils = Utils = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], Utils);
//# sourceMappingURL=utils.js.map