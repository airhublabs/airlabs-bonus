import { Report } from '@prisma/client';
import { DateTime } from 'luxon';
import { CreateReportDto } from '../dto/create-report.dto';

export class ReportCreatorService {
  private readonly start: DateTime;
  private readonly end: DateTime;

  constructor(private readonly report: CreateReportDto) {
    // Date transfered over the wire is a string, prisma converts it but we're using the raw DTO  in this case.
    this.start = DateTime.fromISO(this.report.from_date as unknown as string);
    this.end = DateTime.fromISO(this.report.to_date as unknown as string);
  }

  zeroPad(number: number) {
    return number <= 9999 ? `000${number}`.slice(-2) : number;
  }

  /**
   * Check if the report from date is before the to date. Edge Case.
   */
  isFromDateBeforeToDate() {
   return this.report.from_date < this.report.to_date
  }

  /**
   * Get the duration of a report/flight
   */
  getReportDuration() {
    const duration = this.end.diff(this.start, ['hours', 'minutes', 'seconds']);

    return `${this.zeroPad(duration.hours)}:${this.zeroPad(
      duration.minutes
    )}:${this.zeroPad(duration.seconds)}`;
  }
}
