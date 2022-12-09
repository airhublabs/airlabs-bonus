import SettingsIcon from '@mui/icons-material/Settings';
import { Button, ButtonGroup, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useListEmployees } from '../lib/api/employees/employees.query';
import EmployeeUploadModal from '../lib/components/file-upload/EmployeeUploadModal';
import FileUploadModal from '../lib/components/file-upload/FIleUploadModal';

export function Index() {
  const employeesQuery = useListEmployees();
  const router = useRouter();
  const [isReportsUploadModalOpen, setReportsUploadModalOpen] = useState(false);
  const [isEmployeeUploadModalOpen, setEmployeeUploadModalOpen] = useState(false);

  const columns: GridColDef[] = [
    { field: 'emp_no', headerName: 'Emp #' },
    { field: 'id', headerName: 'ID', width: 10 },
    {
      field: 'human_resource_full_name',
      headerName: 'Name',
      width: 190,
      renderCell: (params) => <a href={`/employees/${params.id}`}>{params.value}</a>,
    },
    { field: 'human_resource_brq', headerName: 'BRQ' },
    { field: 'human_resource_rank', headerName: 'FO' },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'homebase', headerName: 'Homebase' },
    {
      field: 'data-actions',
      headerName: '',
      disableColumnMenu: true,
      disableReorder: false,
      filterable: false,
      sortable: false,
      width: 50,
      align: 'center',
      editable: false,
    },
  ];

  return (
    <>
      <main>
        <Stack
          component="header"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb="var(--space-sm)"
        >
          <Stack>
            <Typography variant="h2">Security Bonus Calculator</Typography>
            <Typography variant="body1">Calculatre cabin & flight crew danger bonuses</Typography>
          </Stack>

          <Stack direction="row" alignItems="center" gap="var(--space-2xs)">

            <Button variant="contained" href="/report">
              Run Report
            </Button>
            <Button variant="outlined" onClick={() => setReportsUploadModalOpen(true)}>
              Upload Reports
            </Button>

            <Button variant="outlined" onClick={() => setEmployeeUploadModalOpen(true)}>
              Upload Employees
            </Button>

            <Tooltip title="Change danger zone settings" arrow>
              <IconButton onClick={() => router.push('/settings')}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        <div className="table-container">
          <Stack gap="var(--space-xs)">
            <div className="data-grid-wrap">
              <DataGrid
                rows={employeesQuery?.data || []}
                columns={columns}
                loading={employeesQuery.isLoading}
                components={{
                  Toolbar: ExportToolbar,
                }}
              />
            </div>
          </Stack>
        </div>
      </main>

      <FileUploadModal
        open={isReportsUploadModalOpen}
        onClose={() => setReportsUploadModalOpen(false)}
      />
      <EmployeeUploadModal
        open={isEmployeeUploadModalOpen}
        onClose={() => setEmployeeUploadModalOpen(false)}
      />

      <style jsx>{`
        main {
          padding: var(--space-sm);
          width: 100%;
          height: 100%;
        }

        .data-grid-wrap {
          width: 100%;
          height: 700px;
        }
      `}</style>
    </>
  );
}

const ExportToolbar = () => {
  return <GridToolbar />;
};

export default Index;
