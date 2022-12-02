import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

/*
Questions that need calerfied
- How to determin starting a new project? Is it when you see the code again. -
- What happens when the arriaval loc is the same as departue.
- Is homebase on a monthly bases or overall. - On a daily bases, only from midnight untilo 3 pm
- Do danger zones need to be updated from code or databse - databse
- Base DSS / ERBL

- API endpoint for extracting bonus days to put into their system
*/

export interface BonusServiceParams {
  reports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
  hazardPayRate: number;
}

/* TODO: Switch to dynamic danger zones */
const DANGER_ZONES = ['ERBL', 'SNGL3', 'SNGL4', 'DSS', 'EBL'];

export class BonusCalculatorServiceV2 {
  public dangerousProjectIds!: number[];

  constructor(private readonly params: BonusServiceParams) {
    this.dangerousProjectIds = [];
  }

  isLeavingHomebase(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      report.dep_string === this.params.employee.homebase &&
      report.arr_string !== this.params.employee.homebase
    );
  }

  isArrivingAtHomebase(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      report.dep_string !== this.params.employee.homebase &&
      report.arr_string === this.params.employee.homebase
    );
  }

  isDangerousProject(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      (DANGER_ZONES.includes(report.code) || DANGER_ZONES.includes(report.arr_string)) &&
      !this.isEndOfProjectInMiddleMonth({ report })
    );
  }

  isEndOfProjectInMiddleMonth(params: { report: ReportsApi.RetriveResponseBody }) {
    return DANGER_ZONES.includes(params.report.code) && this.isArrivingAtHomebase(params.report);
  }

  getEligbleBonusHours(): number {
    let isAssignedDangerousProject = false;
    let dangerousProjectStartDate: string | undefined = undefined;
    let dangerousCode: string | undefined = undefined;

    return this.params.reports.reduce((amount, report, i) => {
      /* Danger code detected */
      if (this.isDangerousProject(report)) {
        isAssignedDangerousProject = true;
        dangerousCode = report.code;
        console.debug('Assigned hazard -', { code: report.code, date: report.start_date });
      }

      /* Has left homebase with assigned dangerous project. */
      if (
        this.isLeavingHomebase(report) &&
        isAssignedDangerousProject &&
        !dangerousProjectStartDate
      ) {
        dangerousProjectStartDate = report.start_date;
        console.debug('Left homebase -', { date: report.start_date });
      }

      if (isAssignedDangerousProject && dangerousProjectStartDate) {
        this.dangerousProjectIds.push(report.id);
      }

      /* Arrived at homebase with assigned dangerous project. Signifies end of project */
      if (
        this.isArrivingAtHomebase(report) &&
        isAssignedDangerousProject &&
        dangerousProjectStartDate
      ) {
        const bonusPayDays = DateTime.fromISO(report.to_date).diff(
          DateTime.fromISO(dangerousProjectStartDate),
          ['day']
        ).days;

        amount += bonusPayDays;
        isAssignedDangerousProject = false;
        dangerousProjectStartDate = undefined;
        console.debug('Arrived at homebase -', {
          date: report.start_date,
          code: report.code,
          days: bonusPayDays,
        });
      }

      /* End of a dangerous project with no start date in the current month */
      if (this.isEndOfProjectInMiddleMonth({ report })) {
        // TODO: Assumes all data is within the current month
        const firstOfMonthDate = DateTime.fromISO(this.params.reports[0].start_date)
          .toLocal()
          .startOf('month');

        const bonusPayDays = DateTime.fromISO(report.from_date).diff(firstOfMonthDate, [
          'day',
        ]).days;

        console.debug('Found end of project with no start -', {
          date: report.to_date,
          bonusDays: bonusPayDays,
        });
      }

      // TODO: Switch to checking end of month insted of end of array.
      // End of month. Check if they were still in a dangerous project. Add it to the current month.
      if (
        i === this.params.reports.length - 1 &&
        isAssignedDangerousProject &&
        dangerousProjectStartDate
      ) {
        const bonusPayDays = DateTime.fromISO(report.to_date).diff(
          DateTime.fromISO(dangerousProjectStartDate),
          ['day']
        ).days;

        console.debug('Found no end of hazard pay', {
          bonusDays: bonusPayDays,
          start: dangerousProjectStartDate,
          date: report.to_date,
        });
        amount += bonusPayDays;
      }

      return amount;
    }, 0);
  }

  getMonthsBothPay(): number {
    return this.getEligbleBonusHours() * this.params.hazardPayRate;
  }
}

export class BonusCalculatorService {
  constructor(private readonly params: BonusServiceParams) {}

  hasLeftHomebase(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      report.dep_string === this.params.employee.homebase &&
      report.arr_string !== this.params.employee.homebase
    );
  }

  hasArrivedAtHomebase(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      report.arr_string === this.params.employee.homebase &&
      report.dep_string !== this.params.employee.homebase
    );
  }

  isEndOfProjectInMiddleMonth(params: { report: ReportsApi.RetriveResponseBody }) {
    return DANGER_ZONES.includes(params.report.code) && this.hasArrivedAtHomebase(params.report);
  }

  getEligbleBonusHours(): number {
    let isAssignedDangerousProject = false;
    let dangerousProjectStartDate: string | undefined = undefined;
    let dangerousCode: string | undefined = undefined;

    return this.params.reports.reduce((amount, report, i) => {
      /* Danger code detected */
      if (DANGER_ZONES.includes(report.code) && !this.isEndOfProjectInMiddleMonth({ report })) {
        isAssignedDangerousProject = true;
        dangerousCode = report.code;
        console.debug('Assigned hazard -', { code: report.code, date: report.start_date });
      }

      /* Has left homebase with assigned dangerous project. */
      if (
        this.hasLeftHomebase(report) &&
        isAssignedDangerousProject &&
        !dangerousProjectStartDate
      ) {
        dangerousProjectStartDate = report.start_date;
        console.debug('Left homebase -', { date: report.start_date });
      }

      /* Arrived at homebase with assigned danergous project. Signifes end of project */
      if (
        this.hasArrivedAtHomebase(report) &&
        isAssignedDangerousProject &&
        dangerousProjectStartDate
      ) {
        const bonusPayDays = DateTime.fromISO(report.to_date).diff(
          DateTime.fromISO(dangerousProjectStartDate),
          ['day']
        ).days;

        amount += bonusPayDays;
        console.debug('Arrived at homebase -', {
          date: report.start_date,
          code: report.code,
          days: bonusPayDays,
        });

        isAssignedDangerousProject = false;
        dangerousProjectStartDate = undefined;
      }

      /* End of a dangerous project with no start date in the current month */
      if (this.isEndOfProjectInMiddleMonth({ report })) {
        // TODO: Assumes all data is within the current month
        const firstOfMonthDate = DateTime.fromISO(this.params.reports[0].start_date)
          .toLocal()
          .startOf('month');

        const bonusPayDays = DateTime.fromISO(report.from_date).diff(firstOfMonthDate, [
          'day',
        ]).days;

        console.debug('Found end of project with no start -', {
          date: report.to_date,
          bonusDays: bonusPayDays,
        });
      }

      // TODO: Switch to checking end of month insted of end of array.
      // End of month. Check if they were still in a dangerous project. Add it to the current month.
      if (
        i === this.params.reports.length - 1 &&
        isAssignedDangerousProject &&
        dangerousProjectStartDate
      ) {
        const bonusPayDays = DateTime.fromISO(report.to_date).diff(
          DateTime.fromISO(dangerousProjectStartDate),
          ['day']
        ).days;

        console.debug('Found no end of hazard pay', {
          bonusDays: bonusPayDays,
          start: dangerousProjectStartDate,
          date: report.to_date,
        });
        amount += bonusPayDays;
      }

      return amount;
    }, 0);
  }

  getMonthsBothPay(): number {
    return this.getEligbleBonusHours() * this.params.hazardPayRate;
  }
}
