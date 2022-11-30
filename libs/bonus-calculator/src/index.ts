import { Employee, Report } from '@prisma/client';
import { DateTime } from 'luxon';
import { BonusCalculatorService } from './lib/bonus-calculator.service';
import { MOCK_EMPLOYEE, MOCK_REPORTS } from './lib/mock-data.constant';

/* export const MOCK_DATA: MockDataType = [
  {
    dep_string: 'MAD',
    arr_string: 'EBL',
    code: 'SNGL3',
    id: 1,
    employee_id: 1,
    from_date: DateTime.now().toJSDate(),
    start_date: DateTime.now().toJSDate(),
    to_date: DateTime.now().plus({ hour: 1 }).toJSDate(),
    scheduled_hours_duration: '05:00:00',
    employee: {
      emp_no: 'ALG',
      homebase: 'MAD',
    },
  },
  {
    dep_string: 'EBL',
    arr_string: 'JFK',
    code: 'UD43',
    id: 1,
    employee_id: 1,
    from_date: DateTime.now().plus({ day: 1 }).toJSDate(),
    start_date: DateTime.now().plus({ day: 1 }).toJSDate(),
    to_date: DateTime.now().plus({ day: 1, hour: 5 }).toJSDate(),
    scheduled_hours_duration: '04:00:00',
    employee: {
      emp_no: 'ALG',
      homebase: 'MAD',
    },
  },
  {
    dep_string: 'MAD',
    arr_string: 'MAD',
    code: 'REST',
    id: 1,
    employee_id: 1,
    from_date: DateTime.now().plus({ day: 2 }).toJSDate(),
    start_date: DateTime.now().plus({ day: 2 }).toJSDate(),
    to_date: DateTime.now().plus({ day: 2, hour: 10 }).toJSDate(),
    scheduled_hours_duration: '02:00:00',
    employee: {
      emp_no: 'ALG',
      homebase: 'MAD',
    },
  },
  {
    dep_string: 'MAD',
    arr_string: 'JFK',
    code: 'STLD',
    id: 1,
    employee_id: 1,
    from_date: DateTime.now().plus({ day: 2 }).toJSDate(),
    start_date: DateTime.now().plus({ day: 2 }).toJSDate(),
    to_date: DateTime.now().plus({ day: 2, hour: 10 }).toJSDate(),
    scheduled_hours_duration: '02:00:00',
    employee: {
      emp_no: 'ALG',
      homebase: 'MAD',
    },
  },
]; */

const bonus = new BonusCalculatorService({ reports: MOCK_REPORTS, employee: MOCK_EMPLOYEE, hazardPayRate: 25.5 });

console.log(bonus.getEligbleBonusHours());
