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
import { transformReports } from 'apps/backoffice/lib/views/employees/logic/reports-transform.service';
import ReportDialog from 'apps/backoffice/lib/views/employees/modals/ReportDialog';
import MonthSelect, { MonthSelectProps } from 'apps/backoffice/lib/views/employees/MonthSelect';
import { BonusCalculatorServiceV2 } from 'libs/bonus-calculator/src/lib/bonus-calculator.service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const EmployeeView = () => {
  const { employeeId } = useRouter().query;
  const [bonusData, setBonusData] = useState({ amount: 0, days: 0, dangerousProjectIds: [] });
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [viewingMonth, setViewingMonth] = useState<number>();

  const reportsQuery = useListReports({ employeeId: +employeeId, month: viewingMonth });
  const employeeQuery = useRetriveEmployee(+employeeId);

  const handleUpdateCellData: GridEventListener<'cellEditCommit'> = async (params) => {
    try {
      await api.reports.update(+params.id, { [params.field]: params.value });
      reportsQuery.refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeEvent: MonthSelectProps['onChange'] = (params) => {
    setViewingMonth(params.value);
  };

  useEffect(() => {
    if (!reportsQuery.isSuccess || !employeeQuery.isSuccess) return;

    const bonus = new BonusCalculatorServiceV2({
      reports: reportsQuery.data,
      employee: employeeQuery.data,
      hazardPayRate: 25.5,
    });

    const bonusDays = bonus.getEligbleBonusHours();

    setBonusData({
      days: bonusDays,
      amount: bonus.getMonthsBothPay(),
      dangerousProjectIds: bonus.dangerousProjectIds,
    });
  }, [
    employeeQuery.data,
    employeeQuery.isSuccess,
    reportsQuery.isFetching,
    reportsQuery.data,
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
            value={Math.ceil(bonusData.days)}
            isLoading={reportsQuery.isLoading}
          />
          <DataCard
            title="Bonus Pay x 25.5"
            value={`$${Math.round(bonusData.amount)}`}
            isLoading={reportsQuery.isLoading}
          />
        </Stack>

        <MonthSelect onChange={handleChangeEvent} key="month" />

        <div className="data-grid-wrap">
          <DataGrid
            rows={transformReports(reportsQuery?.data) || []}
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
    <GridToolbarExport
      excelOptions={{
        columnsStyles: {},
      }}
    />
  );
};

export default EmployeeView;
