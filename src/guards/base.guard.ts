import {
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

export class BaseGuard implements CanActivate {
  private readonly logger = new Logger();

  constructor(
    private jwtService: JwtService,
    private jwtSecret: any,
    private prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const start = Date.now(); // Start time

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (token) {
      try {
        const decodedToken = this.jwtService.verify(token, {
          secret: this.jwtSecret,
        });

        request.user = decodedToken.userId;

        return true;
      } catch (error) {
        console.log(error);
        const elapsed = Date.now() - start; // Elapsed time in milliseconds
        this.logRequest(request, 401, elapsed); // Log the failed request

        throw new UnauthorizedException(
          `Invalid token error: ${error.message}`,
        );
      }
    } else {
      const elapsed = Date.now() - start; // Elapsed time in milliseconds
      this.logRequest(request, 401, elapsed); // Log the failed request (token not found)

      throw new UnauthorizedException('User not authorized');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private logRequest(
    request: Request,
    statusCode: number,
    elapsed: number,
  ): void {
    const method = request.method;
    const url = request.url;

    this.logger.log(`${method} ${url} ${statusCode} - ${elapsed}ms`);
  }
}
