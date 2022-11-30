import { Employee, Prisma, Report } from '@prisma/client';
import { parse } from 'path';

export const parseStringDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(':');
  return { hours: +hours, minutes: +minutes, seconds: +seconds };
};

export type ReportWithStringDates = Omit<Report, 'start_date' | 'from_date' | 'to_date'> & {
  start_date: string;
  from_date: string;
  to_date: string;
};

export type EmployeeWithStringType = Omit<Employee, 'type'> & { type: string };

export interface BonusServiceParams {
  reports: ReportWithStringDates[];
  employee: EmployeeWithStringType;
  hazardPayRate: number;
}

/* TODO: Switch to dynamic danger zones */
const DANGER_ZONES = ['ERBL', 'SNGL3', 'SNGL4'];

export class BonusCalculatorService {
  constructor(private readonly params: BonusServiceParams) {}

  hasLeftHomebase(report: ReportWithStringDates): boolean {
    return (
      report.dep_string === this.params.employee.homebase &&
      report.arr_string !== this.params.employee.homebase
    );
  }

  getEligbleBonusHours(): number {
    /** Employee has been assigned a dangrous flight but hasn't left homebase yet. */
    let assignedDangerousFlight = false;

    /**Employee is currently being paid at hazard pay rate. */
    let isEligbleForBonusPay = false;

    return this.params.reports.reduce((amount, report) => {
      // Assigned Dangrous flight
      if (DANGER_ZONES.includes(report.code)) {
        assignedDangerousFlight = true;
      }

      // Has started dengrous flight. by leaving their homebase Start counting time.
      if (assignedDangerousFlight && !isEligbleForBonusPay && this.hasLeftHomebase(report)) {
        isEligbleForBonusPay = true;
      }

      if (isEligbleForBonusPay) {
        const { hours, minutes, seconds } = parseStringDuration(report.scheduled_hours_duration);
        amount += hours * this.params.hazardPayRate;
        amount += minutes * (this.params.hazardPayRate / 60);
        amount += seconds * (this.params.hazardPayRate / 3600);
      }

      // Dangrous Flight ended
      if (isEligbleForBonusPay && report.arr_string === this.params.employee.homebase) {
        isEligbleForBonusPay = false;
        assignedDangerousFlight = false;
      }

      return amount;
    }, 0);
  }
}
