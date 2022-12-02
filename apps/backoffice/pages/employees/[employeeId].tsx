import { ReportsApi } from '@airlabs-bonus/types';
import { Button } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridEventListener, GridToolbarExport } from '@mui/x-data-grid';
import api from 'apps/backoffice/lib/api/airlabs.api';
import { useRetriveEmployee } from 'apps/backoffice/lib/api/employees/employees.query';
import { useListReports } from 'apps/backoffice/lib/api/reports/reports.query';
import DataCard from 'apps/backoffice/lib/components/global/DataCard';
import PageHeader from 'apps/backoffice/lib/components/header/PageHeader';
import { EMPLOYEE_COLUMNS } from 'apps/backoffice/lib/views/employees/constants/employee-columns.constant';
import EmployeeViewHeader from 'apps/backoffice/lib/views/employees/EmployeeViewHeader';
import ReportDialog from 'apps/backoffice/lib/views/employees/modals/ReportDialog';
import MonthSelect, { MonthSelectProps } from 'apps/backoffice/lib/views/employees/MonthSelect';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const EmployeeView = () => {
  const { employeeId } = useRouter().query;
  const [bonusData, setBonusData] = useState({ amount: 0, days: 0 });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewingMonth, setViewingMonth] = useState<number>();
  const reportsQuery = useListReports({ employeeId: +employeeId, month: viewingMonth });
  const employeeQuery = useRetriveEmployee(+employeeId);

  const handleCellEditCommit: GridEventListener<'cellEditCommit'> = async (params) => {
    try {
      const response = await api.reports.update(+params.id, { [params.field]: params.value });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEvent: MonthSelectProps['onChange'] = (params) => {
    setViewingMonth(params.value);
  };

  const removeRedudentdateFromReports = (reports: ReportsApi.ListResponseBody) => {
    if (!reports) return;
    let intitalReportDate: string | undefined = undefined;

    return reports.map((report) => {
      if (DateTime.fromISO(report.from_date).day === DateTime.fromISO(intitalReportDate).day) {
        report.from_date = '';
      } else {
        intitalReportDate = report.from_date;
      }

      return report;
    });
  };

  useEffect(() => {
    if (!reportsQuery.isSuccess || !employeeQuery.isSuccess) return;

    // /* TODO: Fix type error */
    // const bonus = new BonusCalculatorService({
    //   // @ts-ignore
    //   reports: reportsQuery.data,
    //   // @ts-ignore
    //   employee: employeeQuery.data,
    //   hazardPayRate: 25.5,
    // });

    // setBonusData({ days: bonus.getEligbleBonusHours(), amount: bonus.getMonthsBothPay() });
  }, [
    employeeQuery.data,
    reportsQuery.isFetching,
    reportsQuery.data,
    reportsQuery.isSuccess,
    employeeQuery.isSuccess,
  ]);

  return (
    <>
      {employeeQuery.isSuccess && (
        <EmployeeViewHeader
          brq={employeeQuery.data.human_resource_brq}
          employeeNumber={employeeQuery.data.emp_no}
          name={employeeQuery.data.human_resource_full_name}
          homebase={employeeQuery.data.homebase}
        />
      )}

      <main>
        <PageHeader
          actions={
            <Button variant="contained" size="medium" onClick={() => setIsReportModalOpen(true)}>
              Create Report
            </Button>
          }
        />

        <Stack direction="row" gap="var(--space-sm)">
          <DataCard
            title="Bonus Days"
            value={Math.round(bonusData.days)}
            isLoading={reportsQuery.isLoading}
          />
          <DataCard
            title="Bonus Pay x 25.5"
            value={`$${Math.round(bonusData.amount)}`}
            isLoading={reportsQuery.isLoading}
          />
          <DataCard title="Most Visted" value="Madrid" isLoading={reportsQuery.isLoading} />
        </Stack>

        <MonthSelect onChange={handleChangeEvent} key="month" />

        <div className="data-grid-wrap">
          <DataGrid
            rows={removeRedudentdateFromReports(reportsQuery?.data) || []}
            onCellEditCommit={handleCellEditCommit}
            columns={EMPLOYEE_COLUMNS}
            loading={reportsQuery.isLoading}
            density="compact"
            initialState={{ columns: { columnVisibilityModel: { id: false } } }}
            components={{
              Toolbar: ExportToolbar,
            }}
          />
        </div>
      </main>

      {/* TODO: Add back in, module import issue from Localization */}
      {/* <ReportDialog
        type="create"
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      /> */}

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

export default EmployeeView;
