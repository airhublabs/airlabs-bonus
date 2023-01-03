import { ReportsApi } from '@airlabs-bonus/types';
import { DateTime } from 'luxon';

export interface RosterGenerationParams {
  arr: string;
  dep: string;
  from_date: string;
  to_date: string;
  code?: string;
  registration?: string;
}

export const generateRoster = (
  ...params: RosterGenerationParams[]
): ReportsApi.ListResponseBody => {
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
