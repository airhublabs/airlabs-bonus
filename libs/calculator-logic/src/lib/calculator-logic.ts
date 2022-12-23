/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

export interface BonusServiceParams {
  reports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
}

export class CalculatorService {
  constructor(private readonly params: BonusServiceParams) {}

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

  private isDateBetweenDates({
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
}
