import { Employee, Prisma, Report } from '@prisma/client';

export const parseStringDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(':');
  return { hours: +hours, minutes: +minutes, seconds: +seconds };
};

/* export type MockDataType = (Omit<
  Report,
  'project_name_text' | 'vehicle_type' | 'roster_designators' | 'registration'
> & {
  employee: Omit<
    Employee,
    'id' | 'human_resource_brq' | 'human_resource_full_name' | 'human_resource_rank' | 'type'
  >;
})[]; */

export type ReportsWithEmployees = (Report & {employee: Employee});

/* TODO: Switch to dynamic danger zones */
const DANGER_ZONES = ['ERBL', 'SNGL3', 'SNGL4'];

export class BonusCalculatorService {
  constructor(private readonly reports: ReportsWithEmployees) {}

  getEligbleBonusHours(): number {
    let assignedDangerousFlight = false;
    let isEligbleForBonus = false;
    let dangerousFlightStartDate: Date | undefined = undefined;

    return this.reports.reduce((amount, report) => {
      // Assigned Dangrous flight
      if (DANGER_ZONES.includes(report.code)) {
        assignedDangerousFlight = true;
      }

      // Has started dengrous flight. Start counting time.
      if (
        assignedDangerousFlight &&
        !isEligbleForBonus &&
        report.dep_string === report.employee.homebase &&
        report.arr_string !== report.employee.homebase
      ) {
        dangerousFlightStartDate = report.start_date;
        isEligbleForBonus = true;
      }

      // Add 25 for every hour they fly
      if (isEligbleForBonus) {
        amount += parseStringDuration(report.scheduled_hours_duration).hours * 25.5;
      }

      // Dangrous Flight ended
      if (dangerousFlightStartDate && report.arr_string === report.employee.homebase) {
        dangerousFlightStartDate = undefined;
        isEligbleForBonus = false;
        assignedDangerousFlight = false;
      }

      return amount;
    }, 0);
  }
}
