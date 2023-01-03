import { Prisma } from '@prisma/client';
import { BatchCreateEmployeeDto } from '../dto/batch-create-employee.dto';

export class EmployeeUploadService {
  constructor(private readonly jsonReports: BatchCreateEmployeeDto[]) {}

  convertReportToPrismaSchema() {
    return this.jsonReports.map((report) => this.transformReportToPrismaSchema(report));
  }

  private transformReportToPrismaSchema(
    report: BatchCreateEmployeeDto
  ): Prisma.EmployeeCreateInput {
    return {
      emp_no: report.EmpNo,
      homebase: report.HomeBases,
      human_resource_brq: 'Adam ',
      human_resource_full_name: 'Adam Ghowiba',
      human_resource_rank: '10321',
      agency: "",
      contract_type: "",
      employment_type: "",
      type: "CABIN",
    };
  }
}
