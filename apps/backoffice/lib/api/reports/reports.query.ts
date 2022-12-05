import { ReportsApi } from '@airlabs-bonus/types';
import { useQuery } from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { endOfMonthDate, startOfMonthDate } from '../../utils/date.utils';
import api from '../airlabs.api';

export const useListReports = (params: { employeeId: number; month: number }) => {
  const fetchReports = async () =>
    (
      await api.reports.list({
        employeeId: params.employeeId,
        query: {
          start_date: startOfMonthDate(params.month - 1).toISO(),
          end_date: endOfMonthDate(params.month).toISO(),
        },
      })
    ).data;

  const reportsQuery = useQuery({
    queryKey: ['employees', { employeeId: params.employeeId, month: params.month }],
    queryFn: fetchReports,
    enabled: !!params.employeeId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return reportsQuery;
};

interface AggergateReportReturn {
  currentMonthReports: ReportsApi.ListResponseBody;
  previousMonthReports: ReportsApi.ListResponseBody;
}

export const aggergateReportMonths = (params: {
  currentMonth: number;
  reports: ReportsApi.ListResponseBody;
}): AggergateReportReturn => {
  if (!params?.reports) return { currentMonthReports: [], previousMonthReports: [] };

  return params.reports.reduce(
    (acc: AggergateReportReturn, report) => {
      const lStartDate = DateTime.fromISO(report.start_date);

      if (lStartDate.month === params.currentMonth) {
        acc.currentMonthReports.push(report);
        return acc;
      }

      acc.previousMonthReports.push(report);

      return acc;
    },
    { currentMonthReports: [], previousMonthReports: [] }
  );
};
