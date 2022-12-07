import { IsOptional, IsString } from 'class-validator';

export class BatchCreateReportDto {
  @IsString()
  EmpNo!: string;

  @IsString()
  HumanResourceFullName!: string;

  @IsString()
  HumanResourceBRQ!: string;

  @IsString()
  HumanResourceRank!: string;

  @IsString()
  StartDate!: string;

  @IsString()
  ValidFromDate!: string;

  @IsString()
  ValidFromTime!: string;

  @IsString()
  ValidToDate!: string;

  @IsString()
  ValidToTime!: string;

  @IsString()
  Code!: string;

  @IsString()
  @IsOptional()
  Registration!: string;

  @IsString()
  @IsOptional()
  VehicleType!: string;

  @IsString()
  DepString!: string;

  @IsString()
  ArrString!: string;

  @IsString()
  ScheduledHoursDuration!: string;

  @IsString()
  @IsOptional()
  RosterDesignators!: string;

  @IsString()
  @IsOptional()
  ProjectNameText!: string;
}
