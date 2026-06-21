import { Test, TestingModule } from '@nestjs/testing';
import { DraftsController } from './drafts.controller';

describe('DraftsController', () => {
  let controller: DraftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DraftsController],
    }).compile();

    controller = module.get<DraftsController>(DraftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
