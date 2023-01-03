import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist';
import { Employee, EmployeeType } from '@prisma/client';
import { IsEnum, IsString } from 'class-validator';
import { OmitCreateDtoFields } from '../../../types/helpers.type';

export class CreateEmployeeDto implements OmitCreateDtoFields<Employee> {
  @ApiProperty()
  @IsString()
  contract_type!: string;

  @ApiProperty()
  @IsString()
  employment_type!: string;

  @ApiProperty()
  @IsString()
  agency!: string;

  @IsString()
  @ApiProperty()
  emp_no!: string;

  @IsString()
  @ApiProperty()
  homebase!: string;

  @IsString()
  @ApiProperty()
  human_resource_full_name!: string;

  @IsString()
  @ApiProperty()
  human_resource_brq!: string;

  @IsString()
  @ApiProperty()
  human_resource_rank!: string;

  @IsEnum(EmployeeType)
  @ApiPropertyOptional({ enum: EmployeeType })
  type!: EmployeeType;
}
