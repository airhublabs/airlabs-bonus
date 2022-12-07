import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BatchCreateEmployeeDto {
  @ApiProperty()
  @IsString()
  ID!: string;

  @ApiProperty()
  @IsString()
  EmpType!: string;

  @ApiProperty()
  @IsString()
  EmpNo!: string;

  @ApiProperty()
  @IsString()
  Status!: string;

  @ApiProperty()
  @IsString()
  HomeBases!: string;
}
