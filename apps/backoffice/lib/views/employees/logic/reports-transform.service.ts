import { ReportsApi } from '@airlabs-bonus/types';
import { parseStringDuration } from '@airlabs-bonus/utils';
import { DateTime } from 'luxon';

/**
 * Strips the redundent `from` dates within the dataset.
 * @param reports Array of reports
 * @returns Reports with redundant dates removed
 */
export const removeRedundantDateFromReports = (reports: ReportsApi.ListResponseBody) => {
  let initialReportDate: string | undefined = undefined;

  return reports.map((report) => {
    if (DateTime.fromISO(report.from_date).day === DateTime.fromISO(initialReportDate).day) {
      report.from_date = '';
    } else {
      initialReportDate = report.from_date;
    }

    return report;
  });
};

/**
 * Determins which base has the most time spent
 * @param reports Array of reports
 * @returns the base with the most time spent. IE. DXB or JFK
 */
export const getMostTimeSpentHomebase = (reports: ReportsApi.ListResponseBody) => {
  const hoursMap = reports.reduce((acc, report) => {
    const { hours } = parseStringDuration(report.scheduled_hours_duration);

    acc[report.dep_string] = hours;
    return acc;
  }, {});

  return Object.keys(hoursMap).reduce((a, b) => (hoursMap[a] > hoursMap[b] ? a : b));
};

/**
 * Takes a lsit of reports and adds the most visited/most time spent to the data rows
 * @param reports Array of reports to transform
 * @returns Transformed reports
 */
export const transformMostTimeSpentHomebase = (reports: ReportsApi.ListResponseBody) => {
  let startTickingDate: string | undefined = undefined;
  let checkingReportArray: typeof reports[number][] = [];

  return reports.map((report, i) => {
    const nextReportDate = reports?.[i + 1]?.from_date;
    const isFromDateEmpty = report.from_date !== '';

    if (isFromDateEmpty && nextReportDate == '') {
      startTickingDate = report.from_date;
    }

    if (startTickingDate) {
      checkingReportArray = [...checkingReportArray, reports[i]];
    }

    if (startTickingDate && nextReportDate !== '') {
      const mostTimeSpentHomebase = getMostTimeSpentHomebase(checkingReportArray);

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      report.most_visited = mostTimeSpentHomebase;

      startTickingDate = undefined;
      checkingReportArray = [];
    }

    return report;
  });
};

/**
 * Preforms a list of transformations on reports
 * @param reports  Array of reports
 * @returns
 */
export const transformReports = (reports: ReportsApi.ListResponseBody) => {
  if (!reports) return;

  const reportsWithRedudentDatesStripped = removeRedundantDateFromReports(reports);
  const reportsWithMostVisited = transformMostTimeSpentHomebase(reportsWithRedudentDatesStripped);

  return reportsWithMostVisited;
};
