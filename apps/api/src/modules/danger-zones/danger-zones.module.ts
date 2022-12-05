import { Module } from '@nestjs/common';
import { DangerZonesService } from './danger-zones.service';
import { DangerZonesController } from './danger-zones.controller';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  controllers: [DangerZonesController],
  providers: [DangerZonesService, PrismaService],
})
export class DangerZonesModule {}
