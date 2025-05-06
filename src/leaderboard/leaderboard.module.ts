import { Module } from '@nestjs/common';
import { LeaderboardService } from './leaderboard.service';
import { LeaderboardController } from './leaderboard.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Utils } from 'src/utils/utils';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [LeaderboardController],
  providers: [LeaderboardService, PrismaService, Utils],
})
export class LeaderboardModule {}
