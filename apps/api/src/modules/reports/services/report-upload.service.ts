import { Prisma } from '@prisma/client';
import { transformRosterDate } from '../../../common/helpers/date.utils';
import { BatchCreateReportDto } from '../dto/batch-create-report.dto';

export class ReportUploadService {
  constructor(private readonly jsonReports: BatchCreateReportDto[]) {}

  convertReportToPrismaSchema() {
    return this.jsonReports.map((report) => this.transformReportToPrismaSchema(report));
  }

  private transformReportToPrismaSchema(report: BatchCreateReportDto): Prisma.ReportCreateInput {
    const { fromDate, toDate } = transformRosterDate(report);

    return {
      arr_string: report.ArrString,
      dep_string: report.DepString,
      registration: report.Registration,
      project_name_text: report.ProjectNameText,
      roster_designators: report.RosterDesignators,
      vehicle_type: report.VehicleType,
      code: report.Code,
      scheduled_hours_duration: report.ScheduledHoursDuration,
      to_date: toDate,
      from_date: fromDate,
      start_date: fromDate,
      employee: { connect: { emp_no: report.EmpNo } },
    };
  }
}
