import { Test, TestingModule } from '@nestjs/testing';
import { DangerZonesController } from './danger-zones.controller';
import { DangerZonesService } from './danger-zones.service';

describe('DangerZonesController', () => {
  let controller: DangerZonesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DangerZonesController],
      providers: [DangerZonesService],
    }).compile();

    controller = module.get<DangerZonesController>(DangerZonesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
