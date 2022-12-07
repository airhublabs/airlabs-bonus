import SettingsIcon from '@mui/icons-material/Settings';
import { Button, ButtonGroup, IconButton, TextField, Tooltip, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useListEmployees } from '../lib/api/employees/employees.query';
import FileUploadModal from '../lib/components/file-upload/FIleUploadModal';

export function Index() {
  const employeesQuery = useListEmployees();
  const router = useRouter();
  const [isFileUploadModalOpen, setFileUploadModalOpen] = useState(false);

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

          <Stack direction="row" alignItems="center">
            <Button variant="contained" onClick={() => setFileUploadModalOpen(true)}>
              Upload Reports
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
            <TextField name="code" placeholder="Search by code..." variant="outlined" />
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

      <FileUploadModal open={isFileUploadModalOpen} onClose={() => setFileUploadModalOpen(false)} />

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
