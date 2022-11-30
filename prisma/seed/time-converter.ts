import { DateTime } from 'luxon';
import { parseStringDuration } from '../../apps/api/src/common/helpers/time.helper';

interface RosterTimeFormat {
  StartDate: string;
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
}: RosterTimeFormat) => {
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
