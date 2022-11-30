import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ListReportsDto {
  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  start_date?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  end_date?: string;
}
