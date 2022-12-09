/* eslint-disable @typescript-eslint/ban-ts-comment */
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

const getMostTimeSpentBase = (params: {
  startDate: string;
  endDate: string;
  departureBase: string;
  arrivalBase: string;
}) => {
  const { startDate, departureBase, arrivalBase } = params;
  const lDepartureDate = DateTime.fromISO(startDate);

  const startOfDate = lDepartureDate.startOf('day');

  const startDiff = lDepartureDate.diff(startOfDate, ['hour']);
  const endDiff = 24 - startDiff.hours;

  return startDiff.hours > endDiff ? departureBase : arrivalBase;
};

const getTimeSpentInBaseHours = (params: {
  startDate: string;
  endDate: string;
  departureBase: string;
  arrivalBase: string;
}) => {
  const { startDate, departureBase, arrivalBase } = params;
  const lDepartureDate = DateTime.fromISO(startDate);
  const startOfDate = lDepartureDate.startOf('day');
  const startDiff = lDepartureDate.diff(startOfDate, ['hour']);

  const endDiffInHours = 24 - startDiff.hours;
  const startDiffInHours = 24 - startDiff.hours;

  return { [departureBase]: startDiffInHours, [arrivalBase]: endDiffInHours };
};

const newGetTimeSPentInBase = (reports: ReportsApi.ListResponseBody) => {
  const timeInBases = reports.reduce((acc: Record<string, number>, report, i) => {
    const nextReport = reports?.[i + 1];

    const departureDate = DateTime.fromISO(report.start_date);
    const startOfDepartureDay = departureDate.startOf('day');

    if (i === 0) {
      /* First flight */
      const flightStartHours = departureDate.diff(startOfDepartureDay, 'hour').hours;
      acc[report.dep_string] = (acc?.[report.dep_string] || 0) + flightStartHours;
      return acc;
    }

    if (nextReport) {
      /* Middle flight */
      const toDate = DateTime.fromISO(report.to_date);
      const nextStartDate = DateTime.fromISO(report.start_date);

      const timeUntilNextFlight = toDate.diff(nextStartDate, 'hour').hours;

      if (timeUntilNextFlight >= 0)
        acc[report.arr_string] = (acc?.[report.arr_string] || 0) + timeUntilNextFlight;
      return acc;
    }

    /* Last flight */
    const toDate = DateTime.fromISO(report.to_date);
    const timeUntilEndOfDay = DateTime.fromISO(report.to_date).diff(toDate.endOf('day')).hours;

    acc[report.arr_string] = (acc?.[report.arr_string] || 0) + timeUntilEndOfDay;

    return acc;
  }, {});

  return timeInBases;
};

/**
 * Determins which base has the most time spent
 * @param reports Array of reports
 * @returns the base with the most time spent. IE. DXB or JFK
 */
export const getMostTimeSpentHomebaseV2 = (reports: ReportsApi.ListResponseBody) => {
  const hoursMap = reports.reduce((acc, report) => {
    const timeInBases = newGetTimeSPentInBase(reports);

    acc = { ...acc, ...timeInBases };
    return acc;
  }, {});

  return Object.keys(hoursMap).reduce((a, b) => (hoursMap[a] > hoursMap[b] ? a : b));
};

/**
 * Takes a lsit of reports and adds the most visited/most time spent to the data rows
 * @param reports Array of reports to transform
 * @returns Transformed reports
 */
export const transformMostTimeSpentHomebaseV2 = (reports: ReportsApi.ListResponseBody) => {
  let startTickingDate: string | undefined = undefined;
  let checkingReportArray: typeof reports[number][] = [];

  return reports.map((report, i) => {
    const nextReportDate = reports?.[i + 1]?.from_date;
    const isFromDateEmpty = report.from_date == '';

    const mostTimeSpentBase = getMostTimeSpentBase({
      arrivalBase: report.arr_string,
      departureBase: report.dep_string,
      endDate: report.dep_string,
      startDate: report.start_date,
    });

    //@ts-ignore

    if (nextReportDate !== '') report.most_visited = mostTimeSpentBase;

    if (!isFromDateEmpty && nextReportDate == '') {
      startTickingDate = report.from_date;
    }

    if (startTickingDate) {
      checkingReportArray = [...checkingReportArray, reports[i]];
    }

    if (startTickingDate && nextReportDate !== '') {
      const mostTimeSpentHomebase = getMostTimeSpentHomebaseV2(checkingReportArray);

      // @ts-ignore
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
  const reportsWithMostVisited = transformMostTimeSpentHomebaseV2(reportsWithRedudentDatesStripped);

  return reportsWithMostVisited;
};
