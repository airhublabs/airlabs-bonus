/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';
import { ChildProcess } from 'child_process';
import { DateTime } from 'luxon';

interface ScanningServiceParams {
  reports: ReportsApi.ListResponseBody;
  previousReports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
  dangerZones: string[];
}

interface BonusReportRow {
  locationCode: string;
  locationString: string;
  type: 'per_diem' | 'security';
  date: string;
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
    const isLeavingHomebase =
      report.dep_string === this.params.employee.homebase &&
      report.arr_string !== this.params.employee.homebase;

    const neitherInHomebase =
      report.arr_string !== this.params.employee.homebase ||
      report.dep_string !== this.params.employee.homebase;

    const isArrivingAtHomebase =
      report.dep_string !== this.params.employee.homebase &&
      report.arr_string === this.params.employee.homebase;

    return isLeavingHomebase || neitherInHomebase || isArrivingAtHomebase;
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

  private getLeftHomebaseDateDifference(params: {
    projectStartDate: string;
    projectEndDate: string;
  }) {
    const leftHomebaseDate = DateTime.fromISO(params.projectStartDate as string);
    const departureDate = DateTime.fromISO(params.projectEndDate);

    const secruityBonusDays = departureDate
      .startOf('day')
      .diff(leftHomebaseDate.startOf('day'), ['days']).days;

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

  checkForPreviousDangerProject() {
    let hasLeftHomebase = false;
    let isAssignedDangerousProject = false;

    return this.params.previousReports.reduce((acc, report) => {
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

  /**
   * Runs the scan and outputs all per diems, secruity bonuses, etc.
   */
  runScan() {
    let lastScannedDay: number;
    let previousDangerousProject = this.checkForPreviousDangerProject();

    return this.params.reports.reduce(
      (acc, report, i, reports) => {
        const startDate = DateTime.fromISO(report.start_date);

        /* TODO: Test Code */
        if (
          DateTime.fromISO(reports?.[i + 1]?.from_date)?.day &&
          DateTime.fromISO(reports[i + 1].from_date).day > startDate.day + 1 &&
          startDate.day !== lastScannedDay
        ) {
          console.log('Next is missing ID', report.id);
        }

        if (this.isLeavingHomebase(report) && !this.leftHomebaseDate) {
          this.leftHomebaseDate = report.from_date;
        }

        if (this.isNotInHomebase(report) && lastScannedDay !== startDate.day) {
          const sameDayFlights = reports.filter(
            (report) =>
              DateTime.fromISO(report.from_date).day === startDate.day &&
              DateTime.fromISO(report.from_date).month === startDate.month
          );
          const firstFlight = sameDayFlights[0];
          const lastFlightOfDay = sameDayFlights[sameDayFlights.length - 1];
          const isMultiDayFlight = sameDayFlights.length > 1;
          const flightHasPositioning = !!sameDayFlights.filter((_report) => _report.code === 'POS')
            .length;
          const lastFlightIsHomebase = lastFlightOfDay.arr_string === this.params.employee.homebase;
          const isLeavingHomebase = firstFlight.dep_string === this.params.employee.homebase;
          const lastFlightIsSameDay =
            startDate.day === DateTime.fromISO(lastFlightOfDay.to_date).day;
          const flightHasRegistration = lastFlightOfDay.registration;

          /* Is Same Day flights */
          const isNotEligible = () => {
            const notEligble =
              isLeavingHomebase &&
              isMultiDayFlight &&
              lastFlightIsHomebase &&
              (lastFlightIsSameDay || !flightHasRegistration);

            return notEligble && !flightHasPositioning;
          };

          if (isNotEligible()) return acc;

          this.bonusReportRows.push({
            type: 'per_diem',
            date: DateTime.fromISO(report.start_date).toFormat('dd-MM-yy'),
            locationCode: '',
            locationString: 'not set',
          });

          acc.perDiem += 1;
          this.dangerousProjectIds.push(report.id);
        }

        /* Arrivng with previous dangerous project */
        if (
          (this.isArrivingAtHomebase(report) || i === this.params.reports.length - 1) &&
          previousDangerousProject
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

          acc.secruityBonusDays += bonusPayDays;
          this.dangerousProjectIds = [...this.dangerousProjectIds, ...dangerousIds];
          this.leftHomebaseDate = undefined;
          this.isAssignedDangerousProject = false;
          previousDangerousProject = false;
        }

        /* Arriving at homebase with dangerous project */
        if (
          (this.isArrivingAtHomebase(report) || i === this.params.reports.length - 1) &&
          this.leftHomebaseDate &&
          this.isAssignedDangerousProject
        ) {
          const dangerousStart = this.leftHomebaseDate || startDate.startOf('month').toISO();
          const dangerousEnd =
            DateTime.fromISO(report.to_date).month ==
            DateTime.fromISO(report.from_date).plus({ month: 1 }).month
              ? DateTime.fromISO(report.from_date).startOf('day')
              : DateTime.fromISO(report.to_date).startOf('day');

          if (this.isAssignedDangerousProject) {
            acc.secruityBonusDays +=
              this.getLeftHomebaseDateDifference({
                projectStartDate: dangerousStart,
                projectEndDate: dangerousEnd.toISO(),
              }) + 1;
          }

          console.log('Calculating bonus', {
            start: dangerousStart,
            dangerousEnd: dangerousEnd.toISO(),
          });

          const dangerousIds = this.getDangerousIds({
            dangerousStart: dangerousStart,
            endDate: report.start_date,
          });
          this.dangerousProjectIds = [...this.dangerousProjectIds, ...dangerousIds];

          this.leftHomebaseDate = undefined;
          this.isAssignedDangerousProject = false;
        }

        if (startDate.day !== lastScannedDay) {
          lastScannedDay = startDate.day;
        }

        if (this.isArrivingAtHomebase(report)) {
          this.leftHomebaseDate = undefined;
          this.isAssignedDangerousProject = false;
        }

        return acc;
      },

      { secruityBonusDays: 0, perDiem: 0 } as { secruityBonusDays: number; perDiem: 0 }
    );
  }
}
