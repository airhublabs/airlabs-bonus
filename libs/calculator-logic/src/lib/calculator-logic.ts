/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

interface ScanningServiceParams {
  reports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
  dangerZones: string[];
}

interface BonusReportRow {
  locationCode: string;
  locationString: string;
  type: 'per_diem' | 'security';
}

export class ScanningService {
  private leftHomebaseDate: string | undefined;
  private isAssignedDangerousProject: boolean;
  public dangerousProjectIds: number[];
  public bonusReportRows: BonusReportRow[];

  constructor(private params: ScanningServiceParams) {
    this.leftHomebaseDate = undefined;
    this.isAssignedDangerousProject = false;
    this.dangerousProjectIds = [];
    this.bonusReportRows = [];
  }

  private isLeavingHomebase(report: ReportsApi.RetriveResponseBody): boolean {
    return (
      report.dep_string === this.params.employee.homebase &&
      report.arr_string !== this.params.employee.homebase
    );
  }

  private isNotInHomebase(report: ReportsApi.RetriveResponseBody) {
    return (
      report.arr_string !== this.params.employee.homebase ||
      report.dep_string !== this.params.employee.homebase
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

  private checkAssignedDangerousProject(report: ReportsApi.RetriveResponseBody) {
    return this.isDangerousProject(report) && !this.isAssignedDangerousProject;
  }

  private isArrvingAtHomebaseWithBonus(
    report: ReportsApi.RetriveResponseBody,
    currentIndex: number
  ) {
    return (
      (this.isArrivingAtHomebase(report) || currentIndex === this.params.reports.length - 1) &&
      this.isAssignedDangerousProject &&
      this.leftHomebaseDate
    );
  }

  private getLeftHomebaseDateDifference(report: ReportsApi.RetriveResponseBody) {
    const leftHomebaseDate = DateTime.fromISO(this.leftHomebaseDate as string);
    const departureDate = DateTime.fromISO(report.from_date);

    const secruityBonusDays =
      departureDate.startOf('day').diff(leftHomebaseDate.startOf('day'), ['days']).days + 1;

    console.log('Calculating difference', {
      leftHomebaseDate: this.leftHomebaseDate,
      departureDate: report.start_date,
    });

    return secruityBonusDays;
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

  /**
   * Runs the scan and outputs all per diems, secruity bonuses, etc.
   */
  runScan() {
    // let checkingPerDiemDay = 0;
    let lastScannedDay: number;

    return this.params.reports.reduce(
      (acc, report, i) => {
        const startDate = DateTime.fromISO(report.start_date);

        if (this.isLeavingHomebase(report)) {
          this.leftHomebaseDate = report.from_date;
        }

        if (this.checkAssignedDangerousProject(report)) {
          this.isAssignedDangerousProject = true;
        }

        if (
          this.isAssignedDangerousProject &&
          this.leftHomebaseDate &&
          lastScannedDay !== startDate.day
        ) {
          this.bonusReportRows.push({
            locationCode: report.arr_string,
            locationString: 'not set',
            type: 'security',
          });
        }

        if (this.isNotInHomebase(report) && lastScannedDay !== startDate.day) {
          this.bonusReportRows.push({
            type: 'per_diem',
            locationCode: report.arr_string,
            locationString: 'not set',
          });
          acc.perDiem += 1;
        }

        /* May not even be needed */
        if (this.isArrvingAtHomebaseWithBonus(report, i) && this.leftHomebaseDate) {
          if (this.isAssignedDangerousProject) {
            acc.secruityBonusDays = this.getLeftHomebaseDateDifference(report);
          }

          const dangerousIds = this.getDangerousIds({
            dangerousStart: this.leftHomebaseDate,
            endDate: report.start_date,
          });
          this.dangerousProjectIds = [...this.dangerousProjectIds, ...dangerousIds];

          this.isAssignedDangerousProject = false;
          this.leftHomebaseDate = undefined;
        }

        if (startDate.day !== lastScannedDay) {
          lastScannedDay = startDate.day;
        }

        return acc;
      },
      { secruityBonusDays: 0, perDiem: 0 } as { secruityBonusDays: number; perDiem: 0 }
    );
  }
}
