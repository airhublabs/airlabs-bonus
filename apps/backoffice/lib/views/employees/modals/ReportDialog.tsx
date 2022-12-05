import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Stack } from '@mui/system';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import api from 'apps/backoffice/lib/api/airlabs.api';
import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export interface ReportDialogProps {
  type: 'edit' | 'create';
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (response: AxiosResponse) => void;
  employeeId: number;
}

const reportSchema = z
  .object({
    dep_string: z.string().min(1, 'Departure location is required'),
    arr_string: z.string().min(1, 'Arrival location is required'),
    code: z.string().min(1, 'Project Code is required'),
    from_date: z.string(),
    to_date: z.string(),
    vehicle_type: z.string().optional(),
  })
  .required();

type ReportSchema = z.infer<typeof reportSchema>;

const ReportDialog: FC<ReportDialogProps> = ({
  type,
  isOpen = false,
  onClose,
  onSubmit,
  employeeId,
}) => {
  const [arrivalDate, setArrivalDate] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReportSchema>({
    resolver: zodResolver(reportSchema),
    mode: 'all',
  });

  const submitHandler = async (data: ReportSchema) => {
    try {
      const response = await api.reports.create({
        arr_string: data.arr_string,
        dep_string: data.dep_string,
        start_date: departureDate,
        from_date: departureDate,
        to_date: arrivalDate,
        vehicle_type: data.vehicle_type,
        employee_id: employeeId,
        code: data.code,
        project_name_text: '',
        registration: '',
        roster_designators: '',
      });

      onSubmit && onSubmit(response);
      onClose && onClose();
    } catch (error) {
      enqueueSnackbar('Failed to create report', { variant: 'error' });
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    reset();
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <>
      <Dialog open={isOpen} fullWidth onClose={handleClose}>
        <form onSubmit={handleSubmit(submitHandler)} method="post">
          <DialogTitle variant="h3">Create Report</DialogTitle>

          <DialogContent>
            <Stack gap={'var(--space-sm)'}>
              <Stack direction="row" gap="var(--space-sm)">
                <TextField
                  label="Departure Location"
                  name="dep_string"
                  error={!!errors?.dep_string}
                  helperText={errors?.dep_string?.message}
                  fullWidth
                  required
                  {...register('dep_string', { required: true, min: 10 })}
                />

                <TextField
                  label="Arrival Location"
                  name="arr_string"
                  error={!!errors?.arr_string}
                  helperText={errors?.arr_string?.message}
                  required
                  fullWidth
                  {...register('arr_string')}
                />
              </Stack>

              <TextField
                label="Project Code"
                name="code"
                error={!!errors?.code}
                helperText={errors?.code?.message}
                required
                fullWidth
                {...register('code')}
              />
              <TextField
                label="Vechical Type"
                name="vehicle_type"
                variant="standard"
                error={!!errors?.code}
                helperText={errors?.code?.message}
                fullWidth
                {...register('vehicle_type')}
              />

              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <Stack direction="row" gap="var(--space-sm)">
                  <DateTimePicker
                    label="Departue Date"
                    // value={getValues('from_date')}
                    // onChange={(value: DateTime) => setValue('from_date', value.toISO())}
                    value={departureDate}
                    onChange={(value: DateTime) => setDepartureDate(value.toISO())}
                    InputProps={{
                      size: 'small',
                      fullWidth: true,
                      name: 'from_date',
                      ...register('from_date'),
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" fullWidth />}
                  />

                  <DateTimePicker
                    label="Arrival Date"
                    // value={getValues('to_date')}
                    // onChange={(value: DateTime) => setValue('to_date', value.toISO())}
                    value={arrivalDate}
                    onChange={(value: DateTime) => setArrivalDate(value.toISO())}
                    InputProps={{ size: 'small', fullWidth: true }}
                    renderInput={(params) => (
                      <TextField
                        variant="standard"
                        fullWidth
                        {...params}
                        {...register('to_date')}
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button color="inherit" onClick={handleClose}>
              Cancel
            </Button>
            <LoadingButton variant="contained" type="submit" loading={isSubmitting}>
              Create
            </LoadingButton>
          </DialogActions>
        </form>
      </Dialog>

      <style jsx>{``}</style>
    </>
  );
};

export default ReportDialog;
