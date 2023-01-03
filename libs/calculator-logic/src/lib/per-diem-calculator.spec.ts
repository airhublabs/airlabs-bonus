import { ReportsApi, EmployeesApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';
import { ScanningService } from './calculator-logic';
import { Console } from 'console';

interface RosterGenerationParams {
  arr: string;
  dep: string;
  from_date: string;
  to_date: string;
  code?: string;
  registration?: string;
}

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

const generateRoster = (...params: RosterGenerationParams[]): ReportsApi.ListResponseBody => {
  return params.map((param, i) => ({
    arr_string: param.arr,
    dep_string: param.dep,
    start_date: param.from_date || DateTime.now().toISO(),
    from_date: param.from_date || DateTime.now().toISO(),
    to_date: param.to_date || DateTime.now().toISO(),
    code: param.code || 'UNSET',
    employee_id: 0,
    employeee: {
      emp_no: 'UN',
      agency: '',
      contract_type: '',
      employment_type: '',
      homebase: '',
      human_resource_brq: '',
      human_resource_full_name: '',
      human_resource_rank: '',
      id: 1,
    },
    registration: param.registration || '',
    scheduled_hours_duration: '20:20',
    id: i,
  }));
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
    // {
    //   dep: 'DMO',
    //   arr: 'DMO',
    //   from_date: DateTime.now().plus({day: 1}).toISO(),
    //   to_date: DateTime.now().plus({day: 2}).toISO(),
    // },
  );
};

describe('GIVEN A REPORT WITH NO PER DIEMS', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('IS SAME DAY & HAS REGISTRATION', () => {
    const reports = getReports();
    reports[2].registration = 'AYT2';
    reports[2].code = 'ADAM IS COOLS';

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
        dep: 'DXB',
        from_date: DateTime.now().toISO(),
        to_date: DateTime.now().toISO(),
      })
    );

    reports[3].to_date = DateTime.now().plus({ day: 1 }).toISO();
    reports[3].registration = 'AYT2';
    reports[3].code = 'POS';

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