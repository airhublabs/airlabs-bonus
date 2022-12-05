import { ApiProperty } from '@nestjs/swagger';
import { DangerZone } from '@prisma/client';
import { CreateDangerZoneDto } from '../dto/create-danger-zone.dto';

export class DangerZoneEntity extends CreateDangerZoneDto implements DangerZone {
  @ApiProperty()
  id!: number;
}
