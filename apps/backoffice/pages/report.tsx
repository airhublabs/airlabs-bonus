/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ReportsApi } from '@airlabs-bonus/types';
import { TextField } from '@mui/material';
import { DataGrid, GridColDef, GridToolbarExport } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import api from '../lib/api/airlabs.api';
import PageHeader from '../lib/components/header/PageHeader';
import MonthSelect, { MonthSelectProps } from '../lib/views/employees/MonthSelect';
import { useListDangerZones } from '../lib/api/zones/zones.query';
import { EMPLOYEE_COLUMNS } from '../lib/views/employees/constants/employee-columns.constant';

const BONUS_REPORTS_COLUMN: GridColDef<ReportsApi.RunBonusReportBody[number]>[] = [
  {
    field: 'emp_no',
    headerName: 'Emp #',
    renderCell: (params) => <a href={`/employees/${params.row.id}`}>{params.value}</a>,
  },
  {
    field: 'bonus',
    headerName: 'Bonus',
  },
  {
    field: 'perDiems',
    headerName: 'Per Diems',
  },
  {
    field: 'vnoPerDiems',
    headerName: 'VNO Per Diems',
    width: 140,
  },
  {
    field: 'id',
    headerName: 'ID',
  },
];

const useRunBonusReport = ({ month }: { month: number }) => {
  const fetchBonusReport = async () => (await api.reports.runReport({ month })).data;

  const bonusReportQuery = useQuery({
    queryFn: fetchBonusReport,
    queryKey: ['bonus', month],
    refetchOnWindowFocus: false,
  });

  return bonusReportQuery;
};

const Report = () => {
  const [viewingMonth, setViewingMonth] = useState<number>(9);
  const [filteredBonusDays, setFilteredBonusDays] = useState([]);
  const [filterEmpNo, setFilterEmpNp] = useState('');
  const [bonusReportColumns, setBonusReportColumn] =
    useState<GridColDef<ReportsApi.RunBonusReportBody[number]>[]>(BONUS_REPORTS_COLUMN);
  const dangerZoneQuery = useListDangerZones();

  const bonusReportQuery = useRunBonusReport({ month: viewingMonth });

  const handleChangeEvent: MonthSelectProps['onChange'] = (params) => {
    setViewingMonth(params.value);
  };

  useEffect(() => {
    if (!bonusReportQuery.data || !filterEmpNo) return;

    setFilteredBonusDays(
      bonusReportQuery.data.filter((report) =>
        report.emp_no.toLowerCase().startsWith(filterEmpNo.toLowerCase())
      )
    );
  }, [filterEmpNo, bonusReportQuery.data]);

  /** @TODO Removed reverting back to old format. (Add back) */
  /*   useEffect(() => {
    if (!dangerZoneQuery.isSuccess || !dangerZoneQuery.data) return;

    setBonusReportColumn((columns) => [
      ...BONUS_REPORTS_COLUMN,
      ...dangerZoneQuery.data.map((d) => ({ field: d.zone, valueFormatter: () => 0 })),
    ]);
  }, [dangerZoneQuery.data, dangerZoneQuery.isSuccess]); */

  return (
    <>
      <PageHeader
        title="Bonus Report"
        breadcrumbLinks={[{ name: 'Home', href: '/' }, { name: 'Bonus Report' }]}
      />

      <main>
        <MonthSelect onChange={handleChangeEvent} month={viewingMonth} key="month" />

        <TextField
          type="search"
          placeholder="Search by Employee Number..."
          label="Employe number"
          variant="outlined"
          onChange={(e) => setFilterEmpNp(e.target.value)}
        />
        <div className="data-grid-wrap">
          <DataGrid
            rows={filterEmpNo ? filteredBonusDays : bonusReportQuery?.data || []}
            columns={bonusReportColumns}
            loading={bonusReportQuery.isLoading}
            density="compact"
            initialState={{ columns: { columnVisibilityModel: { id: false } } }}
            components={{
              Toolbar: ExportToolbar,
            }}
          />
        </div>
      </main>

      <style jsx>{`
        main {
          padding: var(--space-sm);
          padding-top: var(--space-xs);
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .data-grid-wrap {
          display: flex;
          height: 700px;
          width: 100%;

          :global(.danger) {
            background-color: rgba(255, 0, 0, 0.033);

            &:hover {
              background-color: rgba(255, 0, 0, 0.053);
            }
          }
        }
      `}</style>
    </>
  );
};

const ExportToolbar = () => {
  return (
    <GridToolbarExport
      excelOptions={{
        columnsStyles: {},
      }}
    />
  );
};

export default Report;
