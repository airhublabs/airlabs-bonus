/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { EmployeesApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';
import { ScanningService } from '../calculator-logic';
import { generateRoster } from '../tests/calculator-tests.utils';

const MOCK_EMP: EmployeesApi.RetriveResponseBody = {
  agency: '',
  contract_type: '',
  emp_no: '',
  employment_type: '',
  homebase: 'VNO',
  human_resource_brq: '',
  human_resource_full_name: '',
  human_resource_rank: '',
  type: 'CABIN',
};

const getReports = () => {
  return generateRoster(
    {
      dep: 'VNO',
      arr: 'ARR',
      from_date: DateTime.now().toISO(),
      to_date: DateTime.now().toISO(),
    },
    {
      dep: 'ARR',
      arr: 'DXB',
      from_date: DateTime.now().toISO(),
      to_date: DateTime.now().toISO(),
    },
    {
      dep: 'DXB',
      arr: 'VNO',
      from_date: DateTime.now().toISO(),
      to_date: DateTime.now().toISO(),
    }
  );
};

const getMultiDayMidnightReport = () => {
  return generateRoster(
    {
      dep: 'LOS',
      arr: 'LOS',
      from_date: DateTime.now().toISO(),
      to_date: DateTime.now().toISO(),
    },
    {
      dep: 'LOS',
      arr: 'VNO',
      code: 'POS',
      from_date: DateTime.now().toISO(),
      to_date: DateTime.now().plus({ day: 1 }).toISO(),
    },
    {
      dep: 'VNO',
      arr: 'VNO',
      from_date: DateTime.now().plus({ day: 1 }).toISO(),
      to_date: DateTime.now().plus({ day: 2 }).toISO(),
    }
  );
};

describe('GIVEN A REPORT WITH NO PER DIEMS', () => {
  test('IS SAME DAY & HAS REGISTRATION', () => {
    const reports = getReports();
    reports[2].registration = 'AYT2';

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(0);
  });

  test('ENDS ON DIFFERENT DAY & DOESNT HAVE REGISTRATION', () => {
    const reports = getReports();
    reports[2].to_date = DateTime.now().plus({ day: 1 }).toISO();

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(0);
  });
});

describe('GIVEN A REPORT WITH 1 PER DIEM', () => {
  test(`ENDS ON SAME DAY AND IS POS'D`, () => {
    const reports = getReports();
    reports[1].code = 'POS';

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(1);
  });

  test(`ENDS ON DIFFERENT DAY & HAS REGISTRATION`, () => {
    const reports = getReports();
    reports[2].to_date = DateTime.now().plus({ day: 1 }).toISO();
    reports[2].registration = 'AYT2';

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(1);
  });

  /* TODO: Build from EXAMPLE AT ALX DECEMBER ON 12th-13th */
  test(`MULTI DAY MIDNIGHT CASE WHERE NEXT DAY IS OFF`, () => {
    const reports = getMultiDayMidnightReport();

    console.log(reports);

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(2);
  });

  test(`ENDS NOT AT HOMEBASE & SAME DAY`, () => {
    const reports = getReports();
    reports[2].arr_string = 'DXO';

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(1);
  });

  test(`IS DEAPRTING FROM HOMEBASE TO ANOTHER LOCATION`, () => {
    const reports = getReports();
    reports.push(
      ...generateRoster({
        arr: 'DXB',
        dep: 'VNO',
        from_date: DateTime.now().plus({ day: 3 }).toISO(),
        to_date: DateTime.now().plus({ day: 3 }).toISO(),
      })
    );

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(1);
  });

  test(`IS ARRIVING AT HOMEBASE FROM DIFFERENT LOCATION`, () => {
    const reports = getReports();
    reports.push(
      ...generateRoster({
        arr: 'VNO',
        dep: 'DXB',
        from_date: DateTime.now().plus({ day: 3 }).toISO(),
        to_date: DateTime.now().plus({ day: 3 }).toISO(),
      })
    );

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { perDiem } = scanner.runScan();

    expect(perDiem).toBe(1);
  });
});
