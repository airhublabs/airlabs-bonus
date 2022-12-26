import { DateTime } from 'luxon';
import { CSV_FIELDS, CSV_FIELDSV2 } from '../fields.constant';
import { DataExporter } from './data-exporter.service';
import { Roster, TransformedRosterV2 } from './data-transformer';
import { FileImporterService } from './importer/csv-importer.service';
import { ImporterService } from './importer/json-importer.service';

export interface ReportData {
  Report: Roster[];
}

interface Employee {
  BRQ: string;
  EmpNo: string;
  Name: string;
  Shortcode: string;
}

interface DataTransformerParams {
  exporter: DataExporter;
  importer: ImporterService | FileImporterService;
}

type ColumnType = 'string' | 'number' | 'time';

export class DataTransformer {
  private isScanningForEmployee: boolean;
  private scanningEmployeeData: Employee | undefined;
  private report: Roster[];
  private initialized: boolean;
  private columnTypeMap: Map<keyof Roster, ColumnType>;

  constructor(private readonly params: DataTransformerParams) {
    this.isScanningForEmployee = false;
    this.scanningEmployeeData = undefined;
    this.initialized = false;
    this.report = [];
    this.columnTypeMap = new Map<keyof Roster, ColumnType>([['Text10', 'string']]);
  }

  /**
   * Check if the current report is the start of a new employee
   * @param report The report to check for start of scan
   */
  private isStartOfScan(report: Roster) {
    return report.RaidoLab_Name && report.RaidoLab_EmpNo !== 'EmpNo' && report.RaidoLab_ShortCode;
  }

  private isEndOfScan(report: Roster) {
    return report.RaidoLab_Name === 'Name' && report.RaidoLab_EmpNo === 'EmpNo';
  }

  private isInvalidRow(report: Roster) {
    return !report.Text4 && !report.Text2 && !report.Text11 && !report.Text12;
  }

  /**
   * Finds the type of the last seen value in a column
   * @example getColumnType("Dep_String") = string
   * @example getColumnType("ValidFromTime") = time
   * @returns {"string" | "number"}
   */
  private getColumnType(column: keyof typeof this.report[number]): ColumnType {
    if (this.columnTypeMap.has(column)) return this.columnTypeMap.get(column) as ColumnType;

    const firstNonEmptyColumn = this.report.find((columns) => !!columns[column]);

    if (!firstNonEmptyColumn) return 'string';

    const checkingColumn = firstNonEmptyColumn[column];

    if (checkingColumn.includes(':')) {
      this.columnTypeMap.set(column, 'time');
      return 'time';
    }

    if (!isNaN(parseInt(checkingColumn))) {
      this.columnTypeMap.set(column, 'number');
      return 'number';
    }

    this.columnTypeMap.set(column, 'string');
    return 'string';
  }

  /**
   * Gets the default value of an empty column
   */
  private getDefaultColumnValue(columnType: ColumnType): string | number {
    const COLUMN_TYPE_MAP: Record<ColumnType, string> = {
      string: '',
      number: '0',
      time: '00:00',
    };

    return COLUMN_TYPE_MAP[columnType];
  }

  /* Get the time period. IE. 12AUG2022 - 14AUG20222 */
  private getRowPeriod(date: string) {
    const startOfMonth = DateTime.fromFormat(date, 'dd/MM/yyyy').startOf('month');
    const endOfMonth = DateTime.fromFormat(date, 'dd/MM/yyyy').endOf('month');

    if (!startOfMonth.isValid || !endOfMonth.isValid) return '';

    return `${startOfMonth.toFormat('ddMMMyy')} - ${endOfMonth.toFormat('ddMMMyy')}`;
  }

  /**
   * Checks if a given string is a valid date in en-GB format
   * @param date - Date to check validity of
   * @returns {Boolean} true if date is valid
   * @deprecated Not currently being used as invalid rows are being stripped out
   */
  private isValidDate(date: string): boolean {
    return DateTime.fromFormat(date, 'D', {
      locale: 'en-GB',
    }).isValid;
  }

  private convertTimeToDecimal(time: string) {
    const hoursMinutes = time.split(/[.:]/);
    const hours = parseInt(hoursMinutes[0], 10);
    const minutes = hoursMinutes[1] ? parseInt(hoursMinutes[1], 10) : 0;
    return hours + minutes / 60;
  }

  private mapReport(input: Roster, empData: Employee & { date: string }): TransformedRosterV2 {
    const unknownFieldValue = 'Unset';
    const formattedStd = this.formatTime(input.TimeText_ValidFrom);
    const formattedSta = this.formatTime(input.TimeText_ValidToString);

    const formattedAta = this.formatTime(input.TimeText_ActualValidToString);
    const formattedAtd = this.formatTime(input.TimeText_ActualValidFrom);

    const standardBlockHours = input.Text10
      ? this.getTimeDifference({
          departureDate: empData.date,
          departureTime: formattedStd,
          arrivalTime: formattedSta,
        })
      : '0';

    const actualBlockHours = input.Text10
      ? this.getTimeDifference({
          departureDate: empData.date,
          departureTime: formattedAtd,
          arrivalTime: formattedAta,
        })
      : '0';

    const actualBlockCalculation = this.convertTimeToDecimal(actualBlockHours);
    const standardBlockCalculations = this.convertTimeToDecimal(standardBlockHours);

    return {
      // Period: this.getRowPeriod(empData.date),
      Name: empData?.Name || unknownFieldValue,
      EmpNo: empData?.EmpNo || unknownFieldValue,
      Shortcode: empData?.Shortcode || unknownFieldValue,
      BRQ: empData?.BRQ || unknownFieldValue,
      // Date: empData.date,
      start_date: DateTime.now().toISO(),
      from_date: DateTime.now().toISO(),
      to_date: DateTime.now().toISO(),
      scheduled_hours_duration: '20:30',
      roster_designators: input.Text4,
      code: input.Text2,
      vehicle_type: input.Text8,
      registration: input.Text10,
      dep_string: input.Text11,
      arr_string: input.Text12,
      ci: input.TimeText_CI,
      std: formattedStd,
      atd: formattedAtd,
      sta: formattedSta,
      ata: formattedAta,
      co: input.TimeText_CO_String,
      duty: input.MimerValue1,
      night_fdp: input.MimerValue2,
      sblh: String(standardBlockHours),
      sblhc: standardBlockCalculations.toFixed(2),
      blh: String(actualBlockHours),
      blhc: actualBlockCalculation.toFixed(2),
    };
  }

  fillEmptyReportValues(report: Roster) {
    return Object.entries(report).reduce((acc, [key, value]) => {
      /* Typescript doesn't register this is a key of a roster */
      const rosterKey = key as keyof Roster;

      if (value) {
        acc[rosterKey] = value;
        return acc;
      }

      acc[rosterKey] = this.getDefaultColumnValue(this.getColumnType(rosterKey)).toString();

      return acc;
    }, {} as Roster);
  }

  transformAndExport() {
    const transformedReports = this.transformReport();

    this.params.exporter.export({
      data: transformedReports,
      options: { fields: CSV_FIELDSV2 },
      outputFileName: 'transformed',
      outputFileLocation: '',
    });
  }

  /**
   * Format time
   */
  formatTime(time: string) {
    if (time === '0') return time;

    if (time.length == 3) time = `0${time}`;
    if (time.length == 2) time = `00${time}`;
    if (time.length == 1) time = `000${time}`;

    return `${time[0]}${time[1] || 0}:${time[2] || 0}${time[3] || 0}`;
  }

  getTimeDifference(params: { departureDate: string; departureTime: string; arrivalTime: string }) {
    if (params.arrivalTime === '0') return params.departureTime;
    if (params.departureTime === '0') return params.arrivalTime;

    const validDepartureDate = `${params.departureDate} ${params.departureTime}`;
    const [departureHour, departureMinute] = params.departureTime.split(':');
    const [arrivalHour, arrivalMinute] = params.arrivalTime.split(':');

    try {
      const isNextDay = departureHour > arrivalHour;

      const depDate = DateTime.now().set({ hour: +departureHour, minute: +departureMinute });
      const arrDate = DateTime.now()
        .set({ hour: +arrivalHour, minute: +arrivalMinute })
        .plus({ day: isNextDay ? 1 : 0 });
      const blockHours = arrDate.diff(depDate, ['hour', 'minute']);

      return blockHours ? `${blockHours.hours}:${Math.round(blockHours.minutes)}` : '0:00';
    } catch (error) {
      console.log({ departTime: params.departureTime, arrivalTime: params.arrivalTime });
    }

    return 'Invalid';
  }

  /**
   * Transforms roster data
   * @returns Array of transformed roster data
   */
  transformReport() {
    if (!this.initialized)
      throw new Error('You must run the initialization function before transforming reports');

    let previousLongRunningDate: string | undefined = 'not set';

    return this.report.reduce((acc: TransformedRosterV2[], report, index, reports) => {
      if (this.isStartOfScan(report)) {
        this.isScanningForEmployee = true;
        this.scanningEmployeeData = {
          EmpNo: report.RaidoLab_EmpNo,
          Name: report.RaidoLab_Name,
          Shortcode: report.RaidoLab_ShortCode,
          BRQ: report.RaidoLab_BRQ,
        };
      }

      if (this.isInvalidRow(report)) return acc;

      if (this.isScanningForEmployee && this.scanningEmployeeData) {
        const filledReportRow = this.fillEmptyReportValues(report);

        const nextReport = reports?.[index + 1];
        const lReportDate = DateTime.fromFormat(report.RaidoLab_Name, 'D', {
          locale: 'en-GB',
        }).toFormat('dd/MM/yyyy');

        // Start of a long running date.
        if (nextReport && nextReport.RaidoLab_Name === '' && report.RaidoLab_Name.includes('/')) {
          acc.push(
            this.mapReport(filledReportRow, { ...this.scanningEmployeeData, date: lReportDate })
          );
          previousLongRunningDate = lReportDate;
          return acc;
        }

        // Fill in long-running blank dates with actual date.
        if (previousLongRunningDate && !report.RaidoLab_Name) {
          acc.push(
            this.mapReport(filledReportRow, {
              ...this.scanningEmployeeData,
              date: previousLongRunningDate,
            })
          );
          return acc;
        }

        acc.push(
          this.mapReport(filledReportRow, { ...this.scanningEmployeeData, date: lReportDate })
        );
      }
      return acc;
    }, []);
  }

  async init() {
    if (this.params.importer instanceof FileImporterService) {
      this.report = await this.params.importer.importFile();
      this.initialized = true;
      return;
    }

    if (this.params.importer instanceof ImporterService) {
      this.report = this.params.importer.import();
      this.initialized = true;
      return;
    }
  }
}
