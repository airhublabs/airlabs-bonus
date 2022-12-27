import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

export interface BonusServiceParams {
  reports: ReportsApi.ListResponseBody;
  previousMonthReports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
  hazardPayRate: number;
  dangerZones: string[];
}

const DEFAULT_DANGER_ZONES = ['ERBL', 'SNGL3', 'SNGL4', 'DSS', 'EBL', 'LOS'];

export class BonusCalculatorServiceV2 {
  public dangerousProjectIds!: number[];
  public hasDangerousProjectFromPrevious: boolean;

  constructor(private readonly params: BonusServiceParams) {
    this.dangerousProjectIds = [];
    this.hasDangerousProjectFromPrevious = false;
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
      this.params.dangerZones.includes(report.code) ||
      this.params.dangerZones.includes(report.arr_string)
    );
  }

  private checkForPreviousDangerousProject() {
    let isAssignedDangerousProject = false;
    let hasLeftHomebase = false;

    return this.params.previousMonthReports.reduce((acc, report, i) => {
      /* Has been assigned dangerous project */
      if (this.isDangerousProject(report)) {
        isAssignedDangerousProject = true;
      }

      /* Has left homebase */
      if (this.isLeavingHomebase(report)) {
        hasLeftHomebase = true;
      }

      /* Has left homebase with assigned dangerous project. */
      if (isAssignedDangerousProject && hasLeftHomebase) {
        acc = true;
      }

      /* TODO: Check change (removed && hasLeftHomebase) */
      if (this.isArrivingAtHomebase(report)) {
        hasLeftHomebase = false;
        isAssignedDangerousProject = false;
        acc = false;
      }

      return acc;
    }, false);
  }

  private isBetweenTwoDates({
    checkingDate,
    startDate,
    endDate,
  }: {
    checkingDate: Date;
    startDate: Date;
    endDate: Date;
  }) {
    return checkingDate >= startDate && checkingDate <= endDate;
  }

  private getDangerousIds(params: { dangerousStart: string; endDate: string }) {
    const lStartDate = DateTime.fromISO(params.dangerousStart);
    const lEndDate = DateTime.fromISO(params.endDate);

    return this.params.reports
      .filter((report) => {
        const checkingDate = DateTime.fromISO(report.start_date);

        return this.isBetweenTwoDates({
          checkingDate: checkingDate.toJSDate(),
          startDate: lStartDate.toJSDate(),
          endDate: lEndDate.toJSDate(),
        });
      })
      .map((report) => report.id);
  }

  getEligbleBonusHours(): number {
    let isAssignedDangerousProject = false;
    let hasLeftHomebase = false;
    let dangerousProjectStartDate: string | undefined = undefined;
    let leftHomebaseDate: string | undefined = undefined;
    let hasPreviousDangerousProject = this.checkForPreviousDangerousProject();

    return this.params.reports.reduce((amount, report, i) => {
      if (this.isLeavingHomebase(report)) {
        hasLeftHomebase = true;
        leftHomebaseDate = report.start_date;
      }

      if (hasLeftHomebase && this.isDangerousProject(report) && !dangerousProjectStartDate) {
        dangerousProjectStartDate = leftHomebaseDate;
      }

      /* Dangerous project detected, signifies start of project */
      if (this.isDangerousProject(report) && !isAssignedDangerousProject) {
        isAssignedDangerousProject = true;
        // console.log('Assigned dangerous', { id: report.id, date: report.start_date });
      }

      /* Has left homebase with assigned dangerous project. */
      if (
        this.isLeavingHomebase(report) &&
        isAssignedDangerousProject &&
        hasLeftHomebase &&
        !dangerousProjectStartDate
      ) {
        // console.log('Dangeorus start', { id: report.id, date: report.start_date });
        dangerousProjectStartDate = leftHomebaseDate;
      }

      if (this.isArrivingAtHomebase(report)) {
        hasLeftHomebase = false;
        leftHomebaseDate = undefined;
        isAssignedDangerousProject = false;
        // console.log('Arrived home', { id: report.id, date: report.start_date });
      }

      /* Is arriving at homebase with previous dangergours project */
      if (
        (this.isArrivingAtHomebase(report) || i === this.params.reports.length - 1) &&
        hasPreviousDangerousProject
      ) {
        const firstOfMonthDate = DateTime.fromISO(report.start_date).startOf('month');

        const lStartDate =
          DateTime.fromISO(report.to_date).month ==
          DateTime.fromISO(report.from_date).plus({ month: 1 }).month
            ? DateTime.fromISO(report.from_date)
            : DateTime.fromISO(report.to_date);

        const bonusPay = lStartDate.startOf('day').diff(firstOfMonthDate.startOf('day'), ['day']);
        const bonusPayDays = bonusPay.days + 1;

        const dangerousIds = this.getDangerousIds({
          dangerousStart: firstOfMonthDate.toISO(),
          endDate: report.start_date,
        });

        // console.log('End of dangerous project with previous', {
        //   startDate: firstOfMonthDate.toFormat('MM-dd'),
        //   endDate: lStartDate.toFormat('MM-dd'),
        //   bonusPay: bonusPayDays,
        // });

        this.dangerousProjectIds = [...this.dangerousProjectIds, ...dangerousIds];

        amount += bonusPayDays;
        hasPreviousDangerousProject = false;
        isAssignedDangerousProject = false;
        dangerousProjectStartDate = undefined;
      }

      /* Arrived at homebase with assigned dangerous project. Signifies end of project */
      if (
        (this.isArrivingAtHomebase(report) || i === this.params.reports.length - 1) &&
        isAssignedDangerousProject &&
        dangerousProjectStartDate
      ) {
        const lDangerousProjectStartDate = DateTime.fromISO(dangerousProjectStartDate);
        const lStartDate =
          DateTime.fromISO(report.to_date).month ==
          DateTime.fromISO(report.from_date).plus({ month: 1 }).month
            ? DateTime.fromISO(report.from_date)
            : DateTime.fromISO(report.to_date);

        const bonusPay = lStartDate
          .startOf('day')
          .diff(lDangerousProjectStartDate.startOf('day'), ['day']);
        const bonusPayDays = bonusPay.days + 1;

        // console.log('End of dangerous project', {
        //   startDate: lDangerousProjectStartDate.startOf('day').toISO(),
        //   endDate: lStartDate.toISO(),
        //   bonusPay: bonusPayDays,
        // });

        const dangerousIds = this.getDangerousIds({
          dangerousStart: dangerousProjectStartDate,
          endDate: report.start_date,
        });
        this.dangerousProjectIds = [...this.dangerousProjectIds, ...dangerousIds];

        amount += bonusPayDays;
        isAssignedDangerousProject = false;
        dangerousProjectStartDate = undefined;
      }

      return amount;
    }, 0);
  }

  getMonthsBothPay(): number {
    return Math.ceil(this.getEligbleBonusHours()) * this.params.hazardPayRate;
  }
}
