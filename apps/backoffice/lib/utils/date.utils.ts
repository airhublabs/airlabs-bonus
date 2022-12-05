import { DateTime } from 'luxon';

export const stringifyISO = (isoDate: string) => {
  const lISODate = DateTime.fromISO(isoDate);

  if (!lISODate.isValid) return isoDate;

  return lISODate.toFormat('dd-MM-yy');
};

export const currentMonth = DateTime.now().month;

export const startOfMonthDate = (month: number = currentMonth) =>
  DateTime.now().set({ month }).startOf('month');

export const endOfMonthDate = (month: number = currentMonth) =>
  DateTime.now().set({ month }).endOf('month');
