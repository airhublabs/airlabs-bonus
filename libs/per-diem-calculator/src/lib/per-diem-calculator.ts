/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CalculatorService } from '@airlabs-bonus/calculator-logic';
import { EmployeesApi, ReportsApi } from '@airlabs-bonus/types';

interface PerDiuemCalculatorParams {
  reports: ReportsApi.ListResponseBody;
  employee: EmployeesApi.RetriveResponseBody;
}

// TODO: per diums = Must be outside of their homebase for a full day for it to count
export class PerDiemCalculatorService extends CalculatorService {
  constructor(params: PerDiuemCalculatorParams) {
    super({ employee: params.employee, reports: params.reports });
  }
}
