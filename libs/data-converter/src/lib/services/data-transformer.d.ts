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
  
  export interface TransformedRoster {
    Period: string;
    Name: string;
    EmpNo: string;
    Shortcode: string;
    BRQ: string;
    Date: string;
    Des: string;
    Code: String;
    Type: string;
    Registration: string;
    Dep: string;
    Arr: string;
    CI: string;
    STD: string;
    ATD: string;
    STA: String;
    ATA: string;
    CO: string;
    Duty: string;
    NightFDP: string;
    Block: string;
  }