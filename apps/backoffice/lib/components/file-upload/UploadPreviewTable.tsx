import { BatchCreateReportDto } from '@airlabs-bonus/types';
import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import React, { FC } from 'react';

export interface UploadPreviewTableProps {
  columns: string[];
  rows: unknown[];
  count?: number;
}

const UploadPreviewTable: FC<UploadPreviewTableProps> = ({ columns, rows, count, ...props }) => {
  const PRESET_COLUMN_SIZES: Partial<Record<keyof BatchCreateReportDto, number>> = {
    EmpNo: 70,
    HumanResourceFullName: 150,
    HumanResourceBRQ: 150,
    HumanResourceRank: 80,
    StartDate: 80,
    ValidFromDate: 80,
    ValidFromTime: 80,
    ValidToDate: 80,
    ValidToTime: 80,
    Code: 50,
    DepString: 50,
    ArrString: 50,
  };

  const generateColumns = (): GridColDef[] => {
    // return columns.map((column) => ({ field: column, width: PRESET_COLUMN_SIZES?.[column] || 50 }));
    return columns.map((column) => {
      return { field: column, width: PRESET_COLUMN_SIZES?.[column] || 100 };
    });
  };

  return (
    <>
      <section>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          pb="var(--space-2xs)"
        >
          <Typography variant="h4">Preview Data</Typography>
          {count && <Typography>Data Count: {count}</Typography>}
        </Stack>

        <div className="table-container">
          <DataGrid columns={generateColumns()} rows={rows} sx={{ backgroundColor: 'white' }} />
        </div>
      </section>

      <style jsx>{`
        .table-container {
          width: 100%;
          height: 400px;
        }
      `}</style>
    </>
  );
};

export default UploadPreviewTable;
