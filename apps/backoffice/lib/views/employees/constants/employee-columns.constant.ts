import { ReportsApi } from '@airlabs-bonus/types';
import { GridColDef } from '@mui/x-data-grid';
import { DateTime } from 'luxon';
import { stringifyISO } from '../../../utils/date.utils';

export const EMPLOYEE_COLUMNS: GridColDef<ReportsApi.RetriveResponseBody>[] = [
  {
    field: 'from_date',
    headerName: 'From',
    editable: true,
    description: 'Departure date/project start date',
    valueFormatter: (params) => stringifyISO(params.value),
  },
  {
    field: 'From Time',
    renderCell: (params) => {
      const startTime = DateTime.fromISO(params.row.start_date);

      return startTime.toLocal().toFormat('h:mm a');
    },
  },
  {
    field: 'To Time',
    renderCell: (params) => {
      const toTime = DateTime.fromISO(params.row.to_date);

      return toTime.toLocal().toFormat('h:mm a');
    },
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
  {
    field: 'most_visited',
    headerName: 'Most visited',
    description: 'Most visted base in multi-project days',
  },
];
