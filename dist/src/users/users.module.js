"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const app_service_1 = require("../app.service");
const utils_1 = require("../utils/utils");
const jwt_1 = require("@nestjs/jwt");
const otp_service_1 = require("../otp/otp.service");
const Mailer_1 = require("../utils/Mailer");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({})],
        controllers: [users_controller_1.UserController],
        providers: [
            users_service_1.UsersService,
            prisma_service_1.PrismaService,
            app_service_1.AppService,
            utils_1.Utils,
            otp_service_1.OtpService,
            Mailer_1.Mailer,
        ],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map