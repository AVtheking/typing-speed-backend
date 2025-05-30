"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const core_1 = require("@nestjs/core");
const logging_interceptor_1 = require("./logging/logging.interceptor");
const auth_module_1 = require("./auth/auth.module");
const otp_module_1 = require("./otp/otp.module");
const prisma_service_1 = require("./prisma/prisma.service");
const users_module_1 = require("./users/users.module");
const mailer_1 = require("@nestjs-modules/mailer");
const config_1 = require("@nestjs/config");
const config_2 = require("./config");
const admin_module_1 = require("./admin/admin.module");
const practice_test_module_1 = require("./practice_test/practice_test.module");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const throttler_1 = require("@nestjs/throttler");
const devtools_integration_1 = require("@nestjs/devtools-integration");
const leaderboard_module_1 = require("./leaderboard/leaderboard.module");
const redis_module_1 = require("./redis/redis.module");
const schedule_1 = require("@nestjs/schedule");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            schedule_1.ScheduleModule.forRoot(),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', '..', 'uploads'),
            }),
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            devtools_integration_1.DevtoolsModule.register({
                http: process.env.NODE_ENV !== 'production',
            }),
            auth_module_1.AuthModule,
            otp_module_1.OtpModule,
            users_module_1.UsersModule,
            admin_module_1.AdminModule,
            mailer_1.MailerModule.forRoot({
                transport: {
                    host: config_2.Env.SMTP_HOST,
                    auth: {
                        user: config_2.Env.EMAIL,
                        pass: config_2.Env.EMAIL_PASSWORD,
                    },
                },
            }),
            practice_test_module_1.PracticeTestModule,
            leaderboard_module_1.LeaderboardModule,
            redis_module_1.RedisModule.forRoot({
                host: config_2.Env.REDIS_HOST,
                port: config_2.Env.REDIS_PORT,
            }),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: logging_interceptor_1.LoggingInterceptor,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            prisma_service_1.PrismaService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map