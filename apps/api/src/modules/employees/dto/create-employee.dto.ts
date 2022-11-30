import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger/dist';
import { Employee, EmployeeType } from '@prisma/client';
import { OmitCreateDtoFields } from 'apps/api/src/types/helpers.type';
import { IsEnum, IsString } from 'class-validator';

export class CreateEmployeeDto implements OmitCreateDtoFields<Employee> {
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
