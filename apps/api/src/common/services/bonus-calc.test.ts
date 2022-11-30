import { Employee, Prisma, Report } from '@prisma/client';
import { DateTime } from 'luxon';

type MockDataType = (Omit<Report, 'project_name_text' | 'vehicle_type' | 'roster_designators' | 'registration'> & {
  employee: Omit<Employee, 'id' | 'human_resource_brq' | 'human_resource_full_name' | 'human_resource_rank' | 'type'>;
})[];

const MOCK_DATA: MockDataType = [
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
];

export const parseStringDuration = (duration: string) => {
  const [hours, minutes, seconds] = duration.split(':');
  return { hours: +hours, minutes: +minutes, seconds: +seconds };
};

/* TODO: Switch to dynamic danger zones */
const DANGER_ZONES = ['ERBL', 'SNGL3', 'SNGL4'];

export class BonusCalculatorService {
  constructor(private readonly reports: MockDataType) {}

  getEligbleBonusHours(): number {
    let assignedDangerousFlight = false;
    let isEligbleForBonus = false;
    let dangerousFlightStartDate: Date | undefined = undefined;

    return this.reports.reduce((amount, report) => {
      // Assigned Dangrous flight
      if (DANGER_ZONES.includes(report.code)) {
        assignedDangerousFlight = true;
        console.log('Assigned Flight', report.code);
      }

      // Has started dengrous flight. Start counting time.
      if (
        assignedDangerousFlight &&
        !isEligbleForBonus &&
        report.dep_string === report.employee.homebase &&
        report.arr_string !== report.employee.homebase
      ) {
        dangerousFlightStartDate = report.start_date;
        isEligbleForBonus = true;
      }

      // Add 25 for every hour they fly
      if (isEligbleForBonus) {
        console.log(parseStringDuration(report.scheduled_hours_duration).hours);
        amount += parseStringDuration(report.scheduled_hours_duration).hours * 25.5;
      }

      // Dangrous Flight ended
      if (dangerousFlightStartDate && report.arr_string === report.employee.homebase) {
        dangerousFlightStartDate = undefined;
        isEligbleForBonus = false;
        assignedDangerousFlight = false;
      }

      return amount;
    }, 0);
  }
}

const bonus = new BonusCalculatorService(MOCK_DATA);

console.log(bonus.getEligbleBonusHours());
