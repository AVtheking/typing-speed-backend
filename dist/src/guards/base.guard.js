"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseGuard = void 0;
const common_1 = require("@nestjs/common");
class BaseGuard {
    constructor(jwtService, jwtSecret, prismaService) {
        this.jwtService = jwtService;
        this.jwtSecret = jwtSecret;
        this.prismaService = prismaService;
        this.logger = new common_1.Logger();
    }
    async canActivate(context) {
        const start = Date.now();
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (token) {
            try {
                const decodedToken = this.jwtService.verify(token, {
                    secret: this.jwtSecret,
                });
                const user = await this.prismaService.user.findUnique({
                    where: {
                        id: decodedToken.userId,
                    },
                });
                if (!user) {
                    throw new common_1.UnauthorizedException('User not found');
                }
                request.user = decodedToken.userId;
                return true;
            }
            catch (error) {
                console.log(error);
                const elapsed = Date.now() - start;
                this.logRequest(request, 401, elapsed);
                throw new common_1.UnauthorizedException(`Invalid token error: ${error.message}`);
            }
        }
        else {
            const elapsed = Date.now() - start;
            this.logRequest(request, 401, elapsed);
            throw new common_1.UnauthorizedException('User not authorized');
        }
    }
    extractTokenFromHeader(request) {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
    logRequest(request, statusCode, elapsed) {
        const method = request.method;
        const url = request.url;
        this.logger.log(`${method} ${url} ${statusCode} - ${elapsed}ms`);
    }
}
exports.BaseGuard = BaseGuard;
//# sourceMappingURL=base.guard.js.map