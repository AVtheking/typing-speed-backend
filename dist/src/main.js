"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGlobals = registerGlobals;
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("../http-exception.filter");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
        snapshot: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
    }));
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.enableCors({
        origin: '*',
    });
    registerGlobals(app);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Typing Speed Test ')
        .setDescription('Typing Speed Test API')
        .setVersion('1.0')
        .addTag('Speed test')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
}
function registerGlobals(app) {
    app.useGlobalInterceptors(new common_1.ClassSerializerInterceptor(app.get(core_1.Reflector), {
        strategy: 'excludeAll',
        excludeExtraneousValues: true,
    }));
}
bootstrap();
//# sourceMappingURL=main.js.map