/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

interface ScanningServiceParams {
  reports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
  dangerZones: string[];
}

export class ScanningService {
  private leftHomebaseDate: string | undefined;
  private isAssignedDangerousProject: boolean;

  constructor(private params: ScanningServiceParams) {
    this.leftHomebaseDate = undefined;
    this.isAssignedDangerousProject = false;
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

  private arrivingAtHomebaseWithDangerousProject(
    report: ReportsApi.RetriveResponseBody,
    currentIndex: number
  ) {
    return (
      (this.isArrivingAtHomebase(report) || 1 === this.params.reports.length - 1) &&
      this.isAssignedDangerousProject &&
      this.leftHomebaseDate
    );
  }

  private getLeftHomebaseDateDifference(report: ReportsApi.RetriveResponseBody) {
    const leftHomebaseDate = DateTime.fromISO(this.leftHomebaseDate as string);
    const departureDate = DateTime.fromISO(report.from_date);
    // const arrivalDate = DateTime.fromISO(report.to_date);

    const secruityBonusDays =
      departureDate.startOf('day').diff(leftHomebaseDate.startOf('day')).days + 1;

    return secruityBonusDays;
  }

  /**
   * Runs the scan and outputs all per diems, secruity bonuses, etc.
   */
  runScan() {
    this.params.reports.reduce(
      (acc, report, i) => {
        if (this.isLeavingHomebase(report)) {
          this.leftHomebaseDate = report.dep_string;
        }

        if (this.isDangerousProject(report)) {
          this.isAssignedDangerousProject = true;
        }

        if (this.isArrivingAtHomebase(report) && this.leftHomebaseDate) {
          if (this.isAssignedDangerousProject) {
            acc.secruityBonusDays = this.getLeftHomebaseDateDifference(report);
          }

          acc.perDiem += this.getLeftHomebaseDateDifference(report);
        }

        return acc;
      },
      { secruityBonusDays: 0, perDiem: 0 } as { secruityBonusDays: number; perDiem: 0 }
    );
  }
}
