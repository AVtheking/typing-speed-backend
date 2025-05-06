import { Test, TestingModule } from '@nestjs/testing';
import { PracticeTestController } from './practice_test.controller';
import { PracticeTestService } from './practice_test.service';

describe('PracticeTestController', () => {
  let controller: PracticeTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PracticeTestController],
      providers: [PracticeTestService],
    }).compile();

    controller = module.get<PracticeTestController>(PracticeTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
