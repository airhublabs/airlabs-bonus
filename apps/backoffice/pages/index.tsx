import { DataGrid, GridColDef } from '@mui/x-data-grid';

export function Index() {
  const columns: GridColDef[] = [{ field: 'id', headerName: 'ID' }];

  return (
    <>
      <div className="data-grid-wrap">
        <DataGrid rows={[]} columns={columns} />
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
