import { Module } from '@nestjs/common';
import { PracticeTestService } from './practice_test.service';
import { PracticeTestController } from './practice_test.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [PracticeTestController],
  providers: [PracticeTestService, PrismaService],
})
export class PracticeTestModule {}
