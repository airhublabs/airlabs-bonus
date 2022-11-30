import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import api from 'apps/backoffice/lib/api/airlabs.api';
import { QUERY_KEY } from 'apps/backoffice/lib/constants/query-key.constant';
import {
  currentMonth,
  endOfMonthDate,
  startOfMonthDate,
  stringifyISO,
} from 'apps/backoffice/lib/utils/date.utils';
import MonthSelect, { MonthSelectProps } from 'apps/backoffice/lib/views/employees/MonthSelect';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import React, { FC, Suspense, useEffect, useState } from 'react';

const useListReports = (params: { employeeId: number; month: number }) => {
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
    onSettled: (value) => console.log(value),
    enabled: !!params.employeeId,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return reportsQuery;
};

const EmployeeView = (props) => {
  const { employeeId } = useRouter().query;
  const [viewingMonth, setViewingMonth] = useState<number>();
  const reportsQuery = useListReports({ employeeId: +employeeId, month: viewingMonth });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'code', headerName: 'Code', width: 90 },
    {
      field: 'from_date',
      headerName: 'From',
      valueFormatter: (params) => stringifyISO(params.value),
    },
    { field: 'to_date', headerName: 'To', valueFormatter: (params) => stringifyISO(params.value) },
    { field: 'dep_string', headerName: 'Departure', width: 90 },
    { field: 'arr_string', headerName: 'Arrival', width: 90 },
    { field: 'scheduled_hours_duration', headerName: 'Duration' },
    { field: 'vehicle_type', headerName: 'Veh' },
  ];

  const handleChangeEvent: MonthSelectProps['onChange'] = (params) => {
    setViewingMonth(params.value);
  };

  return (
    <>
      <div className="data-grid-wrap">
        <MonthSelect onChange={handleChangeEvent} key="month" />
        <DataGrid
          rows={reportsQuery?.data || []}
          columns={columns}
          loading={reportsQuery.isLoading}
        />
      </div>

      <style jsx>{`
        .data-grid-wrap {
          width: 100%;
          height: 900px;
        }
      `}</style>
    </>
  );
};
export default EmployeeView;
