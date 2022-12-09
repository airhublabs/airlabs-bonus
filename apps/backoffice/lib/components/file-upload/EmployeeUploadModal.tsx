import { BatchCreateReportDto } from '@airlabs-bonus/types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { FC, useState } from 'react';
import api, { HOST_URL } from '../../api/airlabs.api';
import UploadPreviewTable from './UploadPreviewTable';
import UploadZone, { ExpectedReportFile } from './UploadZone';
import axios from 'axios';
import { LoadingButton } from '@mui/lab';

export interface EmployeeUploadModalProps {
  open: boolean;
  onClose: () => void;
}

export interface ExepectedEmployeeFile {
  EmpNo: string;
  HomeBases: string;
  EmpType: string;
}

const appendIdToFileUploadReports = (reports: ExepectedEmployeeFile[]) => {
  return reports.map((report) => ({ ...report, id: crypto.randomUUID() }));
};

const EmployeeUploadModal: FC<EmployeeUploadModalProps> = ({ open, onClose, ...props }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [previewData, setPreviewData] = useState<ExepectedEmployeeFile[]>([]);
  const [previewDataCount, setPreviewDataCount] = useState(0);
  /* TODO: Swap to ref */
  const [reportsFile, setReportsFile] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingReports, setIsUploadingReports] = useState(false);

  const handleUpload = (file: File) => {
    const reader = new FileReader();

    reader.readAsText(file);

    reader.onload = () => {
      setIsUploadingReports(true);
    };

    reader.onerror = () => {
      // TODO: Handle error
    };

    reader.onloadend = () => {
      const result = reader.result;
      const resultJson = JSON.parse(result.toString()) as ExepectedEmployeeFile[];

      if (!resultJson?.length)
        return enqueueSnackbar('Invalid file upload format, please try again');

      setPreviewData(resultJson.slice(0, 250));
      setPreviewDataCount(resultJson.length);
      setReportsFile(file);
      setIsUploadingReports(false);
    };
  };

  const onCloseModal = () => {
    onClose();
    setPreviewData([]);
  };

  const handleUploadReports = async () => {
    const formData = new FormData();
    if (!reportsFile) return;

    formData.append('employees', reportsFile);

    try {
      setIsSubmitting(true);
      const response = await axios.post(`${HOST_URL}/v1/employees/batch`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      enqueueSnackbar('Successfully uploaded data', { variant: 'success' });
      onCloseModal();
    } catch (error) {
      enqueueSnackbar('Failed to upload data', { variant: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onCloseModal} maxWidth="lg" fullWidth>
        <DialogTitle variant="h2">Upload Employee JSON File</DialogTitle>

        <DialogContent>
          <DialogContentText pb="var(--space-xs)" maxWidth="65ch">
            Drag and drop or select a JSON file containg the reports. As a note it must be formatted
            according to previosly sent data structure.
          </DialogContentText>

          {previewData?.length ? (
            <UploadPreviewTable
              columns={Object.keys(previewData[0])}
              rows={appendIdToFileUploadReports(previewData)}
              count={previewDataCount}
            />
          ) : (
            <UploadZone onUpload={handleUpload} isLoading={isUploadingReports} />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseModal}>Cancel</Button>
          <LoadingButton
            variant="contained"
            disabled={!previewData?.length}
            onClick={handleUploadReports}
            loading={isSubmitting}
          >
            Upload
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <style jsx>{``}</style>
    </>
  );
};

export default EmployeeUploadModal;
