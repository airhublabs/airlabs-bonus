import { zeroPad } from '@airlabs-bonus/utils';

export const MOCK_EMPLOYEE = {
  id: 9,
  type: 'ATTENDANT',
  emp_no: 'ALG',
  homebase: 'MAD',
  human_resource_full_name: 'ADZGAUSKAS, JONAS',
  human_resource_brq: 'VNO FO/A320',
  human_resource_rank: 'FO',
};

export const MOCK_REPORTS = [
  {
    id: 652,
    start_date: '2022-10-06T02:00:00.000Z',
    from_date: '2022-10-06T02:00:00.000Z',
    to_date: '2022-10-06T08:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 658,
    start_date: '2022-10-04T02:00:00.000Z',
    from_date: '2022-10-04T02:00:00.000Z',
    to_date: '2022-10-04T08:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 659,
    start_date: '2022-10-03T02:00:00.000Z',
    from_date: '2022-10-03T02:00:00.000Z',
    to_date: '2022-10-03T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '08:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 660,
    start_date: '2022-10-04T22:15:00.000Z',
    from_date: '2022-10-04T22:15:00.000Z',
    to_date: '2022-10-05T01:50:00.000Z',
    dep_string: 'VNO',
    arr_string: 'AYT',
    code: 'GW3525',
    scheduled_hours_duration: '03:35:00',
    registration: '9HHUB',
    vehicle_type: '320',
    roster_designators: 'Y,X',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 661,
    start_date: '2022-10-05T02:50:00.000Z',
    from_date: '2022-10-05T02:50:00.000Z',
    to_date: '2022-10-05T06:25:00.000Z',
    dep_string: 'AYT',
    arr_string: 'VNO',
    code: 'GW3526',
    scheduled_hours_duration: '03:35:00',
    registration: '9HHUB',
    vehicle_type: '320',
    roster_designators: '',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 663,
    start_date: '2022-10-01T17:00:00.000Z',
    from_date: '2022-10-01T17:00:00.000Z',
    to_date: '2022-10-02T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 677,
    start_date: '2022-10-06T22:35:00.000Z',
    from_date: '2022-10-06T22:35:00.000Z',
    to_date: '2022-10-07T02:10:00.000Z',
    dep_string: 'VNO',
    arr_string: 'AYT',
    code: 'GW3525',
    scheduled_hours_duration: '03:35:00',
    registration: '9HHUB',
    vehicle_type: '320',
    roster_designators: '',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 679,
    start_date: '2022-10-07T03:10:00.000Z',
    from_date: '2022-10-07T03:10:00.000Z',
    to_date: '2022-10-07T06:45:00.000Z',
    dep_string: 'AYT',
    arr_string: 'VNO',
    code: 'GW3526',
    scheduled_hours_duration: '03:35:00',
    registration: '9HHUB',
    vehicle_type: '320',
    roster_designators: 'Y,X',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 680,
    start_date: '2022-10-27T07:30:00.000Z',
    from_date: '2022-10-27T07:30:00.000Z',
    to_date: '2022-10-27T11:15:00.000Z',
    dep_string: 'VNO',
    arr_string: 'GZP',
    code: 'GW3535',
    scheduled_hours_duration: '03:45:00',
    registration: 'LYELK',
    vehicle_type: '320',
    roster_designators: 'Y',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 681,
    start_date: '2022-10-08T17:00:00.000Z',
    from_date: '2022-10-08T17:00:00.000Z',
    to_date: '2022-10-09T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 683,
    start_date: '2022-10-30T14:30:00.000Z',
    from_date: '2022-10-30T14:30:00.000Z',
    to_date: '2022-10-30T19:40:00.000Z',
    dep_string: 'SSH',
    arr_string: 'VNO',
    code: 'GW3608',
    scheduled_hours_duration: '05:10:00',
    registration: 'LYOWL',
    vehicle_type: '320',
    roster_designators: '',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 684,
    start_date: '2022-10-30T08:45:00.000Z',
    from_date: '2022-10-30T08:45:00.000Z',
    to_date: '2022-10-30T13:30:00.000Z',
    dep_string: 'VNO',
    arr_string: 'SSH',
    code: 'GW3607',
    scheduled_hours_duration: '04:45:00',
    registration: 'LYOWL',
    vehicle_type: '320',
    roster_designators: 'Y,X',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 685,
    start_date: '2022-10-28T17:00:00.000Z',
    from_date: '2022-10-28T17:00:00.000Z',
    to_date: '2022-10-29T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 686,
    start_date: '2022-10-28T05:00:00.000Z',
    from_date: '2022-10-28T05:00:00.000Z',
    to_date: '2022-10-28T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '05:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 687,
    start_date: '2022-10-27T12:15:00.000Z',
    from_date: '2022-10-27T12:15:00.000Z',
    to_date: '2022-10-27T16:05:00.000Z',
    dep_string: 'GZP',
    arr_string: 'VNO',
    code: 'ERBL',
    scheduled_hours_duration: '03:50:00',
    registration: 'LYELK',
    vehicle_type: '320',
    roster_designators: 'X',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 688,
    start_date: '2022-10-25T23:00:00.000Z',
    from_date: '2022-10-25T23:00:00.000Z',
    to_date: '2022-10-26T15:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'RES',
    scheduled_hours_duration: '16:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 689,
    start_date: '2022-10-24T23:00:00.000Z',
    from_date: '2022-10-24T23:00:00.000Z',
    to_date: '2022-10-25T15:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'RES',
    scheduled_hours_duration: '16:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 690,
    start_date: '2022-10-24T02:00:00.000Z',
    from_date: '2022-10-24T02:00:00.000Z',
    to_date: '2022-10-24T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '08:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 691,
    start_date: '2022-10-22T17:00:00.000Z',
    from_date: '2022-10-22T17:00:00.000Z',
    to_date: '2022-10-23T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 692,
    start_date: '2022-10-21T17:00:00.000Z',
    from_date: '2022-10-21T17:00:00.000Z',
    to_date: '2022-10-22T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 693,
    start_date: '2022-10-21T02:00:00.000Z',
    from_date: '2022-10-21T02:00:00.000Z',
    to_date: '2022-10-21T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '08:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 694,
    start_date: '2022-10-07T17:00:00.000Z',
    from_date: '2022-10-07T17:00:00.000Z',
    to_date: '2022-10-08T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 695,
    start_date: '2022-10-20T04:00:00.000Z',
    from_date: '2022-10-20T04:00:00.000Z',
    to_date: '2022-10-20T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 696,
    start_date: '2022-10-19T07:30:00.000Z',
    from_date: '2022-10-19T07:30:00.000Z',
    to_date: '2022-10-19T11:05:00.000Z',
    dep_string: 'VNO',
    arr_string: 'AYT',
    code: 'GW3723',
    scheduled_hours_duration: '03:35:00',
    registration: 'LYOWL',
    vehicle_type: '320',
    roster_designators: 'Y,X',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 697,
    start_date: '2022-10-18T02:00:00.000Z',
    from_date: '2022-10-18T02:00:00.000Z',
    to_date: '2022-10-18T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '08:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 698,
    start_date: '2022-10-17T03:05:00.000Z',
    from_date: '2022-10-17T03:05:00.000Z',
    to_date: '2022-10-17T06:40:00.000Z',
    dep_string: 'AYT',
    arr_string: 'VNO',
    code: 'GW3724',
    scheduled_hours_duration: '03:35:00',
    registration: 'LYELK',
    vehicle_type: '320',
    roster_designators: '',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 699,
    start_date: '2022-10-16T22:30:00.000Z',
    from_date: '2022-10-16T22:30:00.000Z',
    to_date: '2022-10-17T02:05:00.000Z',
    dep_string: 'VNO',
    arr_string: 'AYT',
    code: 'GW3723',
    scheduled_hours_duration: '03:35:00',
    registration: 'LYELK',
    vehicle_type: '320',
    roster_designators: 'Y,X',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 700,
    start_date: '2022-10-15T17:00:00.000Z',
    from_date: '2022-10-15T17:00:00.000Z',
    to_date: '2022-10-16T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 701,
    start_date: '2022-10-14T17:00:00.000Z',
    from_date: '2022-10-14T17:00:00.000Z',
    to_date: '2022-10-15T16:59:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'OFF D',
    scheduled_hours_duration: '23:59:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 702,
    start_date: '2022-10-14T05:00:00.000Z',
    from_date: '2022-10-14T05:00:00.000Z',
    to_date: '2022-10-14T09:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '04:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 703,
    start_date: '2022-10-13T12:15:00.000Z',
    from_date: '2022-10-13T12:15:00.000Z',
    to_date: '2022-10-13T16:05:00.000Z',
    dep_string: 'GZP',
    arr_string: 'VNO',
    code: 'GW3536',
    scheduled_hours_duration: '03:50:00',
    registration: 'LYELK',
    vehicle_type: '320',
    roster_designators: 'X',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 704,
    start_date: '2022-10-13T07:30:00.000Z',
    from_date: '2022-10-13T07:30:00.000Z',
    to_date: '2022-10-13T11:15:00.000Z',
    dep_string: 'VNO',
    arr_string: 'GZP',
    code: 'GW3535',
    scheduled_hours_duration: '03:45:00',
    registration: 'LYELK',
    vehicle_type: '320',
    roster_designators: 'Y',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
  {
    id: 705,
    start_date: '2022-10-12T02:00:00.000Z',
    from_date: '2022-10-12T02:00:00.000Z',
    to_date: '2022-10-12T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '08:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 706,
    start_date: '2022-10-11T02:00:00.000Z',
    from_date: '2022-10-11T02:00:00.000Z',
    to_date: '2022-10-11T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '08:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 707,
    start_date: '2022-10-10T02:00:00.000Z',
    from_date: '2022-10-10T02:00:00.000Z',
    to_date: '2022-10-10T10:00:00.000Z',
    dep_string: 'VNO',
    arr_string: 'VNO',
    code: 'ODAY',
    scheduled_hours_duration: '08:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 708,
    start_date: '2022-10-19T12:05:00.000Z',
    from_date: '2022-10-19T12:05:00.000Z',
    to_date: '2022-10-19T15:40:00.000Z',
    dep_string: 'AYT',
    arr_string: 'VNO',
    code: 'GW3724',
    scheduled_hours_duration: '03:35:00',
    registration: 'LYOWL',
    vehicle_type: '320',
    roster_designators: '',
    project_name_text: 'TezTour',
    employee_id: 9,
  },
];

let case1DayCounter = 1;
export const CASE_1_REPORT = [
  {
    id: 1,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'LYS',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 2,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'LYS',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 3,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad((case1DayCounter += 2))}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'LYS',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 5,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'LYS',
    code: 'RES',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 6,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'LYS',
    code: 'RES',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 7,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad((case1DayCounter += 2))}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'BRU',
    code: 'POS',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 9,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'WOE',
    arr_string: 'AMS',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 10,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'AMS',
    arr_string: 'LYS',
    code: 'POS',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 11,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'DSS',
    arr_string: 'DSS',
    code: 'SNGL3',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 12,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'LYS',
    code: 'RES',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 13,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'LYS',
    code: 'RES',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 14,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'LYS',
    arr_string: 'DSS',
    code: 'POS',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 15,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'DSS',
    arr_string: 'JKF',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 16,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'JKF',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 17,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'JFK',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 18,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'BWI',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 19,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'JFK',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 20,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'JFK',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 21,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'JFK',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 22,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'BWI',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 23,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'BWI',
    arr_string: 'BWI',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 24,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'BWI',
    arr_string: 'BWI',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 25,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'BWI',
    arr_string: 'BWI',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 26,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'BWI',
    arr_string: 'BWI',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 27,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'BWI',
    arr_string: 'JFK',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 28,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad((case1DayCounter += 2))}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'JFK',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
  {
    id: 30,
    start_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    from_date: `2022-10-${zeroPad(case1DayCounter)}T02:00:00.000Z`,
    to_date: `2022-10-${zeroPad(case1DayCounter++)}T08:00:00.000Z`,
    dep_string: 'JFK',
    arr_string: 'DSS',
    code: 'OFF C',
    scheduled_hours_duration: '06:00:00',
    registration: '',
    vehicle_type: '',
    roster_designators: '',
    project_name_text: '',
    employee_id: 9,
  },
];

const generateCase2 = () => {
  let case2DayCounter = 1;
  const routes = [
    ['EBL', 'EBL'],

    ['EBL', 'EBL'],
    ['EBL', 'DUS'],
    ['EBL', 'EBL'],
    ['EBL', 'EBL'],
    ['EBL', 'CGN'],
    ['EBL', 'MUC'],
    ['EBL', 'DUS'],
    ['EBL', 'EBL'],
    ['EBL', 'EBL'],
    ['EBL', 'HAJ'],
    ['HAJ', 'MAD', 'ERBL'],
    ['MAD', 'MAD'],
    ['MAD', 'MAD'],
    ['MAD', 'MAD'],
    ['MAD', 'MAD'],
    ['MAD', 'MAD'],
    ['MAD', 'MAD'],
    ['MAD', 'MAD'],
    ['MAD', 'MAD'],
    ['AMS', 'AMS'],
    ['AMS', 'CTA'],
    ['AMS', 'AMS'],
    ['AMS', 'AGP'],
    ['AMS', 'OLB'],
  ];
  const skipDays = [6, 9, 13, 24, 28];

  return routes.map(([dep, arr, code], i) => {
    if (skipDays.includes(i + 1)) case2DayCounter++;

    return {
      id: i,
      start_date: `2022-10-${zeroPad(case2DayCounter)}T02:00:00.000Z`,
      from_date: `2022-10-${zeroPad(case2DayCounter)}T02:00:00.000Z`,
      to_date: `2022-10-${zeroPad(case2DayCounter++)}T08:00:00.000Z`,
      dep_string: dep,
      arr_string: arr,
      code: code || 'OFF C',
      scheduled_hours_duration: '06:00:00',
      registration: '',
      vehicle_type: '',
      roster_designators: '',
      project_name_text: '',
      employee_id: 9,
    };
  });
};

export const CASE_2_REPORTS = generateCase2();
