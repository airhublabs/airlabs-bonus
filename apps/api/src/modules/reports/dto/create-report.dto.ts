import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Report } from '@prisma/client';
import { IsISO8601, IsNumber, IsOptional, IsString } from 'class-validator';
import { OmitCreateDtoFields } from '../../../types/helpers.type';

export class CreateReportDto implements OmitCreateDtoFields<Report> {
  @IsISO8601()
  @ApiProperty({ type: String })
  start_date!: Date;

  @IsISO8601()
  @ApiProperty({ type: String })
  from_date!: Date;

  @IsISO8601()
  @ApiProperty({ type: String })
  to_date!: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  code!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  registration!: string | null;

  @IsString()
  @ApiProperty()
  dep_string!: string;

  @IsString()
  @ApiProperty()
  arr_string!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  vehicle_type!: string;

  @IsString()
  @IsOptional()
  scheduled_hours_duration!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  roster_designators!: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: String })
  project_name_text!: string;

  @IsNumber()
  employee_id!: number;
}
