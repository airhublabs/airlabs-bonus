import { ApiProperty } from '@nestjs/swagger';
import { DangerZone } from '@prisma/client';
import { OmitCreateDtoFields } from 'apps/api/src/types/helpers.type';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDangerZoneDto implements OmitCreateDtoFields<DangerZone> {
  @IsString()
  @ApiProperty()
  zone!: string;
}
