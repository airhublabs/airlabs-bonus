import { GridColDef } from '@mui/x-data-grid';
import { stringifyISO } from 'apps/backoffice/lib/utils/date.utils';

export const EMPLOYEE_COLUMNS: GridColDef[] = [
  {
    field: 'from_date',
    headerName: 'From',
    editable: true,
    description: 'Departure date/project start date',
    valueFormatter: (params) => stringifyISO(params.value),
  },
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'code',
    headerName: 'Code',
    width: 90,
    editable: true,
    description: 'The project code/name',
  },
  {
    field: 'to_date',
    headerName: 'To',
    description: 'Arrival date/project end date',
    valueFormatter: (params) => stringifyISO(params.value),
    editable: true,
  },
  { field: 'dep_string', headerName: 'Departure', width: 90, editable: true },
  { field: 'arr_string', headerName: 'Arrival', width: 90, editable: true },
  {
    field: 'scheduled_hours_duration',
    headerName: 'Duration',
    description: 'Duration of the project in HH:MM:SS format',
  },
  {
    field: 'vehicle_type',
    headerName: 'Veh',
    editable: true,
    description: 'Vehicle used for the project.',
  },
];
