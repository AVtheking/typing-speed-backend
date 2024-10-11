import { Module } from '@nestjs/common';
import { PracticeTestService } from './practice_test.service';
import { PracticeTestController } from './practice_test.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [PracticeTestController],
  providers: [PracticeTestService, PrismaService, Utils],
})
export class PracticeTestModule {}
