/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ScanningService } from '@airlabs-bonus/calculator-logic';
import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridEventListener, GridToolbar, GridToolbarExport } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import api from '../../lib/api/airlabs.api';
import { useRetriveEmployee } from '../../lib/api/employees/employees.query';
import { aggergateReportMonths, useListReports } from '../../lib/api/reports/reports.query';
import { useListDangerZones } from '../../lib/api/zones/zones.query';
import DataCard from '../../lib/components/global/DataCard';
import PageHeader from '../../lib/components/header/PageHeader';
import EmployeeViewHeader from '../../lib/views/employees/EmployeeViewHeader';
import MonthSelect, { MonthSelectProps } from '../../lib/views/employees/MonthSelect';
import { EMPLOYEE_COLUMNS } from '../../lib/views/employees/constants/employee-columns.constant';
import { transformReports } from '../../lib/views/employees/logic/reports-transform.service';
import ReportDialog from '../../lib/views/employees/modals/ReportDialog';

const EmployeeView = () => {
  const { employeeId } = useRouter().query;
  const [bonusData, setBonusData] = useState({
    amount: 0,
    secuirtyDays: 0,
    perDiemDays: 0,
    dangerousProjectIds: [],
  });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewingMonth, setViewingMonth] = useState<number>(9);
  const { enqueueSnackbar } = useSnackbar();

  const reportsQuery = useListReports({ employeeId: +employeeId, month: viewingMonth });
  const dangerZonesQuery = useListDangerZones();
  const employeeQuery = useRetriveEmployee(+employeeId);

  const handleUpdateCellData: GridEventListener<'cellEditCommit'> = async (params) => {
    // @ts-ignore - Ignored due to value exsiting but not knowing type interface.
    if (params.formattedValue === params.value) return;

    try {
      await api.reports.update(+params.id, { [params.field]: params.value });
      enqueueSnackbar(`Updated report data in report ${params.id}`, { variant: 'success' });

      reportsQuery.refetch();
    } catch (error) {
      enqueueSnackbar(`Failed to update report data`, { variant: 'error' });
    }
  };

  const handleChangeEvent: MonthSelectProps['onChange'] = (params) => {
    setViewingMonth(params.value);
  };

  useEffect(() => {
    if (!reportsQuery.isSuccess || !employeeQuery.isSuccess || !dangerZonesQuery.isSuccess) return;

    const { currentMonthReports, previousMonthReports } = aggergateReportMonths({
      currentMonth: viewingMonth,
      reports: reportsQuery.data,
    });

    const bonus = new ScanningService({
      dangerZones: ['EBL', 'DSS', 'SNGL3', 'LIS'],
      previousReports: previousMonthReports,
      employee: employeeQuery.data,
      reports: currentMonthReports,
    });

    const bonusDays = bonus.runScan();

    console.log(bonus.bonusReportRows);
    setBonusData({
      secuirtyDays: bonusDays.secruityBonusDays,
      amount: bonusDays.secruityBonusDays * 25.5,
      perDiemDays: bonusDays.perDiem,
      dangerousProjectIds: bonus.dangerousProjectIds,
    });
  }, [
    employeeQuery.data,
    viewingMonth,
    employeeQuery.isSuccess,
    reportsQuery.isFetching,
    reportsQuery.data,
    dangerZonesQuery.isSuccess,
    dangerZonesQuery.data,
    reportsQuery.isSuccess,
  ]);

  return (
    <>
      <PageHeader
        actions={
          <Button variant="contained" size="medium" onClick={() => setIsReportModalOpen(true)}>
            Create Report
          </Button>
        }
        title="Employee"
        breadcrumbLinks={[{ name: 'Home', href: '/' }, { name: 'Adam' }]}
      />

      <main>
        {employeeQuery.isSuccess && (
          <EmployeeViewHeader
            brq={employeeQuery.data.human_resource_brq}
            employeeNumber={employeeQuery.data.emp_no}
            name={employeeQuery.data.human_resource_full_name}
            homebase={employeeQuery.data.homebase}
          />
        )}

        <Stack direction="row" gap="var(--space-sm)">
          <DataCard
            title="Bonus Days"
            value={Math.ceil(bonusData.secuirtyDays)}
            isLoading={reportsQuery.isLoading}
          />
          <DataCard
            title="Per Diem"
            value={Math.ceil(bonusData.perDiemDays)}
            isLoading={reportsQuery.isLoading}
          />
          <DataCard
            title="Bonus Pay x 25.5"
            value={`$${Math.round(bonusData.amount)}`}
            isLoading={reportsQuery.isLoading}
          />
        </Stack>

        <MonthSelect onChange={handleChangeEvent} month={viewingMonth} key="month" />

        <div className="data-grid-wrap">
          <DataGrid
            rows={
              transformReports(
                aggergateReportMonths({ currentMonth: viewingMonth, reports: reportsQuery?.data })
                  .currentMonthReports
              ) || []
            }
            columns={EMPLOYEE_COLUMNS}
            loading={reportsQuery.isLoading}
            density="compact"
            initialState={{ columns: { columnVisibilityModel: { id: false } } }}
            components={{
              Toolbar: ExportToolbar,
            }}
            getRowClassName={(params) =>
              `${bonusData.dangerousProjectIds.includes(params.row.id) ? 'danger' : 'row'}`
            }
            onCellEditCommit={handleUpdateCellData}
          />
        </div>
      </main>

      <ReportDialog
        type="create"
        isOpen={isReportModalOpen}
        employeeId={+employeeId}
        onSubmit={() => reportsQuery.refetch()}
        onClose={() => setIsReportModalOpen(false)}
      />

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
          height: 530px;
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
    <GridToolbar
      excelOptions={{
        columnsStyles: {},
      }}
    />
  );
};

export default EmployeeView;
