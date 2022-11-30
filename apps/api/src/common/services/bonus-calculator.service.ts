import { Employee, Prisma, Report } from '@prisma/client';
import { parseStringDuration } from '../helpers/time.helper';

/*
Start and end of project must be defined based on logic whether DSS/EBL flights took
place before or after the project – if flights took place after the project code,
it defines the start of project and if flights take place before, it defines the end of project
*/

/* TODO: Switch to dynamic danger zones */
const DANGER_ZONES = ['ERBL', 'SNGL3', 'SNGL4'];

export class BonusCalculatorService {
  constructor(private readonly reports: (Report & { employee: Employee })[]) {}

  getEligbleBonusHours(): number {
    let assignedDangerousFlight = false;
    let startedDangerousFlight = false;
    let dangerousFlightStartDate: Date | undefined = undefined;

    this.reports.reduce((amount, report) => {
      // Assigned Dangrous flight
      if (DANGER_ZONES.includes(report.code)) {
        assignedDangerousFlight = true;
      }

      // Dangrous Flight ended
      if (dangerousFlightStartDate && report.arr_string === report.employee.homebase) {
        dangerousFlightStartDate = undefined;
        startedDangerousFlight = false;
      }

      // Has started dengrous flight. Start counting time.
      if (
        assignedDangerousFlight &&
        report.dep_string === report.employee.homebase &&
        report.arr_string !== report.employee.homebase
      ) {
        dangerousFlightStartDate = report.start_date;
        startedDangerousFlight = true;
      }

      // Add 25 for every hour they fly
      if (startedDangerousFlight) {
        amount += parseStringDuration(report.scheduled_hours_duration).hours * 25.5;
      }

      return amount;
    }, 0);

    return 0;
  }
}
