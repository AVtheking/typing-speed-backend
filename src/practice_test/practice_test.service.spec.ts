import { Test, TestingModule } from '@nestjs/testing';
import { PracticeTestService } from './practice_test.service';

describe('PracticeTestService', () => {
  let service: PracticeTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PracticeTestService],
    }).compile();

    service = module.get<PracticeTestService>(PracticeTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
