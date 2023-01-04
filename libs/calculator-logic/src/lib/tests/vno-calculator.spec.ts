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

/*
ARR   DEP   FROM  TO

VNO   ARR
ARR   DXB
VNO   VNO
*/

describe('GIVEN A REPORT WITH NO VNO PER DIEMS', () => {
  test('ENDS ON DIFFERENT DAY', () => {
    const reports = getReports();
    reports[2].to_date = DateTime.now().plus({ day: 1 }).toISO();

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { vnoPerDiem } = scanner.runScan();

    expect(vnoPerDiem).toBe(0);
  });

  test('ENDS ON DIFFERENT DAY WITH REG', () => {
    const reports = getReports();
    reports[2].to_date = DateTime.now().plus({ day: 1 }).toISO();
    reports[2].registration = 'AYT2A';

    console.log(reports)

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { vnoPerDiem } = scanner.runScan();

    expect(vnoPerDiem).toBe(0);
  });

  test('ENDS ON SAME DAY WITH NO REGISTRATION', () => {
    const reports = getReports();

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { vnoPerDiem } = scanner.runScan();

    expect(vnoPerDiem).toBe(0);
  });
});

describe('GIVEN A REPORT WITH 1 VNO PER DIEM', () => {
  test('IS SAME DAY & HAS REGISTRATION', () => {
    const reports = getReports();
    reports[2].registration = 'AYT2';

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { vnoPerDiem } = scanner.runScan();

    expect(vnoPerDiem).toBe(1);
  });

  test('IS ARRVING AT SAME DAY & NEXT DAY IS RESET', () => {
    const reports = getReports();
    reports[1].registration = 'AYT2';
    reports[2].dep_string = 'VNO';
    reports[2].code = 'OFF/C';
    reports[2].to_date = DateTime.now().plus({day: 2}).toISO();

    const scanner = new ScanningService({
      dangerZones: [],
      employee: MOCK_EMP,
      previousReports: [],
      reports: reports,
    });

    const { vnoPerDiem } = scanner.runScan();

    expect(vnoPerDiem).toBe(1);
  });
});
