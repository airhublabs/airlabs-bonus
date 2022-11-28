import { ApiProperty } from '@nestjs/swagger/dist';
import { Employee } from '@prisma/client';
import { OmitCreateDtoFields } from 'apps/api/src/types/helpers.type';
import { IsString } from 'class-validator';

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
}
