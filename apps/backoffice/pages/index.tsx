import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useListEmployees } from '../lib/api/employees/employees.query';

export function Index() {
  const employeesQuery = useListEmployees();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 10 },
    {
      field: 'human_resource_full_name',
      headerName: 'Name',
      width: 190,
      renderCell: (params) => <a href={`/employees/${params.id}`}>{params.value}</a>,
    },
    { field: 'emp_no', headerName: 'Emp #' },
    { field: 'human_resource_brq', headerName: 'BRQ' },
    { field: 'human_resource_rank', headerName: 'FO' },
    { field: 'type', headerName: 'Type', width: 120 },
    { field: 'homebase', headerName: 'Homebase' },
  ];

  if (employeesQuery.isLoading || employeesQuery.isInitialLoading) return 'Loading...';

  return (
    <>
      <div className="data-grid-wrap">
        <DataGrid rows={employeesQuery.data} columns={columns} />
      </div>

      <style jsx>{`
        .data-grid-wrap {
          width: 100%;
          height: 400px;
        }
      `}</style>
    </>
  );
}

export default Index;
