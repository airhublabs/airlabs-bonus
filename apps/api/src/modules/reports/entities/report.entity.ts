import { ApiProperty } from "@nestjs/swagger";
import { Report } from "@prisma/client";
import { EmployeeEntity } from "../../employees/entities/employee.entity";
import { CreateReportDto } from "../dto/create-report.dto";

export class ReportEntity extends CreateReportDto implements Report {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  employeee!: EmployeeEntity;
}
