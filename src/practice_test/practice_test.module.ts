import { Module } from '@nestjs/common';
import { PracticeTestService } from './practice_test.service';
import { PracticeTestController } from './practice_test.controller';

@Module({
  controllers: [PracticeTestController],
  providers: [PracticeTestService],
})
export class PracticeTestModule {}
