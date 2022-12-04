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

/*
What happens when
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

  private isLeavingHomebase(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      report.dep_string === this.params.employee.homebase &&
      report.arr_string !== this.params.employee.homebase
    );
  }

  private isArrivingAtHomebase(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      report.dep_string !== this.params.employee.homebase &&
      report.arr_string === this.params.employee.homebase
    );
  }

  private isDangerousProject(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      (DANGER_ZONES.includes(report.code) || DANGER_ZONES.includes(report.arr_string)) &&
      !this.isEndOfProjectInMiddleMonth({ report })
    );
  }

  /* TODO: Use departure danger codes as well as project code */
  private isEndOfProjectInMiddleMonth(params: { report: ReportsApi.RetriveResponseBody }) {
    return DANGER_ZONES.includes(params.report.code) && this.isArrivingAtHomebase(params.report);
  }

  /* TODO: Should this be a function or in constructor */
  getEligbleBonusHours(): number {
    let isAssignedDangerousProject = false;
    let hasLeftHomebase = false;
    let dangerousProjectStartDate: string | undefined = undefined;

    return this.params.reports.reduce((amount, report, i) => {
      if (this.isLeavingHomebase(report)) {
        hasLeftHomebase = true;
        console.log('Left', { date: report.from_date, id: report.id });
      }

      if (hasLeftHomebase && this.isDangerousProject(report) && !dangerousProjectStartDate) {
        dangerousProjectStartDate = report.start_date;
        console.log('Detected project');
      }

      /* Dangerous project detected, signifies start of project */
      if (this.isDangerousProject(report)) {
        isAssignedDangerousProject = true;
        console.log('Assigned hazard -', { code: report.code, date: report.start_date });
      }

      /* Has left homebase with assigned dangerous project. */
      if (
        this.isLeavingHomebase(report) &&
        isAssignedDangerousProject &&
        !dangerousProjectStartDate
      ) {
        dangerousProjectStartDate = report.start_date;
        console.log('Left homebase -', { date: report.start_date });
      }

      if (isAssignedDangerousProject && dangerousProjectStartDate) {
        this.dangerousProjectIds.push(report.id);
      }

      if (this.isArrivingAtHomebase(report)) {
        hasLeftHomebase = false;
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
        const firstOfMonthDate = DateTime.fromISO(report.from_date).startOf('month');

        const bonusPayDays = DateTime.fromISO(report.from_date).diff(firstOfMonthDate, [
          'day',
        ]).days;

        amount += bonusPayDays;

        console.debug('Found end of project with no start -', {
          currentDate: report.to_date,
          bonusDays: bonusPayDays,
        });
      }

      // End of month. Check if they were still in a dangerous project. Add it to the bonus days.
      if (
        i === this.params.reports.length - 1 &&
        isAssignedDangerousProject &&
        dangerousProjectStartDate
      ) {
        const bonusPayDays =
          DateTime.fromISO(report.to_date).diff(DateTime.fromISO(dangerousProjectStartDate), [
            'day',
          ]).days + 1;

        console.log('Found no end of hazard pay', {
          bonusDays: bonusPayDays,
          start: dangerousProjectStartDate,
          date: report.to_date,
        });
        amount += bonusPayDays;

        isAssignedDangerousProject = false;
        dangerousProjectStartDate = undefined;
      }

      return amount;
    }, 0);
  }

  getMonthsBothPay(): number {
    return this.getEligbleBonusHours() * this.params.hazardPayRate;
  }
}
