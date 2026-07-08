import { Test, TestingModule } from '@nestjs/testing';
import { AppConfigService } from './config.service';
import { ConfigService } from '@nestjs/config';

describe('ConfigService', () => {
  let service: AppConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppConfigService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              const config: Record<string, string> = {
                OLLAMA_MODEL: 'mistral',
                OLLAMA_HOST: 'http://localhost:11434',
              }
              return config[key]
            })
          }
        }
      ],
    }).compile();

    service = module.get<AppConfigService>(AppConfigService);
  });

 describe('ollamaModel', () => {
    it('should return mistral', () => {
      expect(service.ollamaModel).toBe('mistral')  
    })
  })
  })
