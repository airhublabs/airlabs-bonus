import { useQuery } from '@tanstack/react-query';
import { endOfMonthDate, startOfMonthDate } from '../../utils/date.utils';
import api from '../airlabs.api';

export const useListReports = (params: { employeeId: number; month: number }) => {
  const fetchReports = async () =>
    (
      await api.reports.list({
        employeeId: params.employeeId,
        query: {
          start_date: startOfMonthDate(params.month).toISO(),
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
