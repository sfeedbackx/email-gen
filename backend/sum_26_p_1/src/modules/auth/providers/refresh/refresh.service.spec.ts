import { Test, TestingModule } from '@nestjs/testing';
import { RefreshProvider } from './refresh.service';

describe('RefreshService', () => {
  let service: RefreshProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RefreshProvider],
    }).compile();

    service = module.get<RefreshProvider>(RefreshProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
