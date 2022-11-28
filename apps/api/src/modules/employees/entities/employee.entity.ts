import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '@prisma/client';
import { IsString } from 'class-validator';
import { CreateEmployeeDto } from '../dto/create-employee.dto';

export class EmployeeEntity extends CreateEmployeeDto implements Employee {
  @IsString()
  @ApiProperty()
  id!: number;
}
