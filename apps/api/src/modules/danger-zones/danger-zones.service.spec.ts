import { Test, TestingModule } from '@nestjs/testing';
import { DangerZonesService } from './danger-zones.service';

describe('DangerZonesService', () => {
  let service: DangerZonesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DangerZonesService],
    }).compile();

    service = module.get<DangerZonesService>(DangerZonesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
