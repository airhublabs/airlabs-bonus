import { ReportsApi } from '@airlabs-bonus/types';
import { parseStringDuration } from '@airlabs-bonus/utils';
import { DateTime } from 'luxon';

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

export const getMostTimeSpentHomebase = (reports: ReportsApi.ListResponseBody) => {
  const hoursMap = reports.reduce((acc, report) => {
    const { hours } = parseStringDuration(report.scheduled_hours_duration);

    acc[report.dep_string] = hours;
    return acc;
  }, {});

  return Object.keys(hoursMap).reduce((a, b) => (hoursMap[a] > hoursMap[b] ? a : b));
};

export const transformMostTimeSpentHomebase = (reports: ReportsApi.ListResponseBody) => {
  // let initialReportDate: string | undefined = undefined;
  let startTickingDate: string | undefined = undefined;
  let checkingReportArray: typeof reports[number][] = [];

  return reports.map((report, i) => {
    const currentReportDay = DateTime.fromISO(report.from_date).day;
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
      report.most_visited = mostTimeSpentHomebase;

      startTickingDate = undefined;
      checkingReportArray = [];
    }

    return report;
  });
};

export const transformReports = (reports: ReportsApi.ListResponseBody) => {
  if (!reports) return;

  const reportsWithRedudentDatesStripped = removeRedundantDateFromReports(reports);
  const reportsWithMostVisited = transformMostTimeSpentHomebase(reportsWithRedudentDatesStripped);

  return reportsWithMostVisited;
};
