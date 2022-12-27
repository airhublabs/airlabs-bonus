import { ApiProperty } from '@nestjs/swagger';

export class BatchGetReportDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  emp_no!: string;

  @ApiProperty()
  bonus!: number;

  @ApiProperty()
  perDiems!: number;
}
