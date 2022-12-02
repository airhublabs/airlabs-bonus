import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Report } from '@prisma/client';
import { IsOptional, IsString } from 'class-validator';
import { EmployeeEntity } from '../../employees/entities/employee.entity';
import { CreateReportDto } from '../dto/create-report.dto';

export class ReportEntity extends OmitType(CreateReportDto, ['code']) implements Report {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  employeee!: EmployeeEntity;

  @IsString()
  @IsOptional()
  @ApiProperty()
  code!: string;
}
