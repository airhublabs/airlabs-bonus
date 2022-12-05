import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

export interface BonusServiceParams {
  reports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
  hazardPayRate: number;
  dangerZones: string[];
}

const DEFAULT_DANGER_ZONES = ['ERBL', 'SNGL3', 'SNGL4', 'DSS', 'EBL'];

export class BonusCalculatorServiceV2 {
  public dangerousProjectIds!: number[];

  constructor(private readonly params: BonusServiceParams) {
    this.dangerousProjectIds = [];
    if (!this.params?.dangerZones?.length) this.params['dangerZones'] = DEFAULT_DANGER_ZONES;
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
      (this.params.dangerZones.includes(report.code) ||
        this.params.dangerZones.includes(report.arr_string)) &&
      !this.isEndOfProjectInMiddleMonth({ report })
    );
  }

  /* TODO: Use departure danger codes as well as project code */
  private isEndOfProjectInMiddleMonth(params: { report: ReportsApi.RetriveResponseBody }) {
    return (
      this.params.dangerZones.includes(params.report.code) &&
      this.isArrivingAtHomebase(params.report)
    );
  }

  /* TODO: Should this be a function or in constructor */
  getEligbleBonusHours(): number {
    let isAssignedDangerousProject = false;
    let hasLeftHomebase = false;
    let dangerousProjectStartDate: string | undefined = undefined;

    return this.params.reports.reduce((amount, report, i) => {
      if (this.isLeavingHomebase(report)) {
        hasLeftHomebase = true;
      }

      /* Dangerous project detected, signifies start of project */
      if (hasLeftHomebase && this.isDangerousProject(report) && !dangerousProjectStartDate) {
        dangerousProjectStartDate = report.start_date;
      }

      if (this.isDangerousProject(report) && !isAssignedDangerousProject) {
        isAssignedDangerousProject = true;
      }

      /* Has left homebase with assigned dangerous project. */
      if (
        this.isLeavingHomebase(report) &&
        isAssignedDangerousProject &&
        !dangerousProjectStartDate
      ) {
        dangerousProjectStartDate = report.start_date;
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
      }

      /* End of a dangerous project with no start date in the current month */
      if (this.isEndOfProjectInMiddleMonth({ report })) {
        const firstOfMonthDate = DateTime.fromISO(report.from_date).startOf('month');

        const bonusPayDays = DateTime.fromISO(report.from_date).diff(firstOfMonthDate, [
          'day',
        ]).days;

        amount += bonusPayDays;
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
