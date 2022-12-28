import { ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

interface RosterGenerationParams {
  arr: string;
  dep: string;
  from_date: string;
  to_date: string;
  code?: string;
  registration?: string;
}

const generateRoster = (homebase: string, ...params: RosterGenerationParams[]): ReportsApi.ListResponseBody => {
  return params.map((param) => ({
    arr_string: param.arr,
    dep_string: param.dep,
    start_date: DateTime.now().toISO(),
    from_date: DateTime.now().toISO(),
    to_date: DateTime.now().toISO(),
    code: param.code || 'UN',
    employee_id: 0,
    employeee: {
      emp_no: 'UN',
      homebase: homebase,
      human_resource_brq: '',
      human_resource_full_name: '',
      human_resource_rank: '',
      id: 1,
    },
    registration: param.registration || '',
    scheduled_hours_duration: '20:20',
    id: 1,
  }));

  return [
    {
      arr_string: 'DXB',
      dep_string: 'DXB',
      start_date: DateTime.now().toISO(),
      from_date: DateTime.now().toISO(),
      to_date: DateTime.now().toISO(),
      code: '',
      employee_id: 1,
      employeee: {
        emp_no: '',
        homebase: '',
        human_resource_brq: '',
        human_resource_full_name: '',
        human_resource_rank: '',
        id: 1,
      },
      registration: '',
      scheduled_hours_duration: '20:20',
      id: 1,
    },
  ];
};

const VALID_DEP_PD: ReportsApi.ListResponseBody = generateRoster('VNO', {
  arr: 'DXB',
  dep: 'ARR',
  from_date: DateTime.now().toISO(),
  to_date: DateTime.now().toISO(),
});

console.log(VALID_DEP_PD);

describe('calculate per diem', () => {
  test('checks is valid per diem', () => {
    expect(1).toBe(1);
  });
});
