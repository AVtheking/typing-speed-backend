import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') return;

    // Reflect to get all model keys dynamically
    const modelKeys = Object.keys(this).filter((key) => {
      return this[key] && typeof this[key].deleteMany === 'function';
    });

    return this.$transaction(
      modelKeys.map((modelKey) => this[modelKey].deleteMany()),
    );
  }
}
