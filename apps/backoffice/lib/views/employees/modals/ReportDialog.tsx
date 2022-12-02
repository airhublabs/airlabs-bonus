import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ModalProps,
  TextField,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import React, { FC } from 'react';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider/LocalizationProvider';

export interface ReportDialogProps {
  type: 'edit' | 'create';
  isOpen?: boolean;
  onClose?: () => void;
}

const ReportDialog: FC<ReportDialogProps> = ({ type, isOpen = false, onClose }) => {
  return (
    <>
      <Dialog open={isOpen} fullWidth onClose={onClose}>
        <DialogTitle>
          <Typography variant="h3">Create Report</Typography>
        </DialogTitle>

        <DialogContent>
          <Stack gap={'var(--space-sm)'}>
            <Stack direction="row" gap="var(--space-sm)">
              <TextField label="Departure Location" size="small" variant="standard" fullWidth />
              <TextField label="Arrival Location" size="small" variant="standard" fullWidth />
            </Stack>
            <TextField label="Project Code" size="small" variant="standard" fullWidth />
            <TextField label="Vechical Type" size="small" variant="standard" fullWidth />
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <Stack direction="row" gap="var(--space-sm)">
                {/* <TextField
                  type="datetime-local"
                  variant="standard"
                  label="Departure Date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                /> */}

                {/* <TextField
                  type="datetime-local"
                  variant="standard"
                  label="Arrival Date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                /> */}

                <DateTimePicker
                  label="Departue Date"
                  value={'2014-08-18T21:11:54'}
                  onChange={() => console.log('')}
                  InputProps={{ size: 'small', fullWidth: true }}
                  renderInput={(params) => <TextField {...params} variant="standard" fullWidth />}
                />

                <DateTimePicker
                  label="Arrival Date"
                  value={'2014-08-18T21:11:54'}
                  onChange={() => console.log('')}
                  InputProps={{ size: 'small', fullWidth: true }}
                  renderInput={(params) => <TextField {...params} variant="standard" fullWidth />}
                />
              </Stack>
            </LocalizationProvider>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      <style jsx>{``}</style>
    </>
  );
};

export default ReportDialog;
