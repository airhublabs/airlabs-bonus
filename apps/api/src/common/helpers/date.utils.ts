import { parseStringDuration } from '@airlabs-bonus/utils';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';

interface JSONReportFormat {
  ValidFromDate: string;
  ValidFromTime: string;
  ValidToDate: string;
  ValidToTime: string;
}

export const transformRosterDate = ({
  ValidFromDate,
  ValidFromTime,
  ValidToDate,
  ValidToTime,
}: JSONReportFormat) => {
  const parsedFromTime = parseStringDuration(ValidFromTime);
  const fromDate = DateTime.fromJSDate(new Date(ValidFromDate)).set({
    hour: parsedFromTime.hours,
    minute: parsedFromTime.minutes,
    second: parsedFromTime.seconds,
  });

  const parsedToTime = parseStringDuration(ValidToTime);
  const toDate = DateTime.fromJSDate(new Date(ValidToDate)).set({
    hour: parsedToTime.hours,
    minute: parsedToTime.minutes,
    second: parsedToTime.seconds,
  });

  return { toDate: toDate.toISO(), fromDate: fromDate.toISO() };
};

export const currentMonth = DateTime.now().month;

export const startOfMonthDate = (month: number = currentMonth) =>
  DateTime.now().set({ month }).startOf('month');

export const endOfMonthDate = (month: number = currentMonth) =>
  DateTime.now().set({ month }).endOf('month');
