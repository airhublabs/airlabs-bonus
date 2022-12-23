export interface Roster {
  RaidoLab_Name: string;
  Text4: string;
  Text2: string;
  CrewOnBoardText: string;
  Text5: string;
  Text8: string;
  Text10: string;
  RaidoLab_EmpNo: string;
  Text11: string;
  Text12: string;
  TimeText_CI: string;
  TimeText_ValidFrom: string;
  TimeText_ActualValidFrom: string;
  RaidoLab_ShortCode: string;
  TimeText_ValidToString: string;
  TimeText_ActualValidToString: string;
  TimeText_CO_String: string;
  MimerValue1: string;
  MimerValue2: string;
  RaidoLab_BRQ: string;
  Text16: string;
  MimerValue3: string;
}

export interface TransformedRosterV2 {
  start_date: string;
  from_date: string;
  to_date: string;
  dep_string: string;
  arr_string: string;
  code: string;
  scheduled_hours_duration: string;
  registration: string;
  vehicle_type: string;
  roster_designators: string;
  ci: string;
  std: string;
  atd: string;
  sta: string;
  ata: string;
  co: string;
  duty: string;
  night_fdp: string;
  block: string;
}

export interface TransformedRoster {
  Period: string;
  Name: string;
  EmpNo: string;
  Shortcode: string;
  BRQ: string;
  Date: string;
  Des: string;
  Code: string;
  Type: string;
  Registration: string;
  Dep: string;
  Arr: string;
  CI: string;
  STD: string;
  ATD: string;
  STA: string;
  ATA: string;
  CO: string;
  Duty: string;
  NightFDP: string;
  Block: string;
}
