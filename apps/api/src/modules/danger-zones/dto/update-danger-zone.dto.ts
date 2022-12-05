import { PartialType } from '@nestjs/swagger';
import { CreateDangerZoneDto } from './create-danger-zone.dto';

export class UpdateDangerZoneDto extends PartialType(CreateDangerZoneDto) {}
