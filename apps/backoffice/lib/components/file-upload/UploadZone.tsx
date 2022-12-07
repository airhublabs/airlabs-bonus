import { BatchCreateReportDto } from '@airlabs-bonus/types';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { CircularProgress, LinearProgress, Link, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { ChangeEvent, FC, useRef } from 'react';

export interface ExpectedReportFile {
  Report: BatchCreateReportDto[];
}

export interface UploadZoneProps {
  height?: number | string;
  isLoading?: boolean;
  onUpload?: (file: File) => void;
}

const UploadZone: FC<UploadZoneProps> = ({
  height = 250,
  onUpload,
  isLoading = false,
  ...props
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files.length) return;

    const firstFile = files.item(0);

    onUpload && onUpload(firstFile);
  };

  return (
    <>
      <div className="zone" style={{ height }}>
        <input
          type="file"
          className="file-input"
          ref={fileInputRef}
          accept="application/json"
          multiple={false}
          onChange={handleFileChange}
        />

        {isLoading ? (
          <CircularProgress />
        ) : (
          <Stack alignItems="center" gap="var(--space-xs)">
            <div className="icon">
              <InsertDriveFileIcon style={{ color: 'var(--color-primary)' }} />
            </div>

            <Stack alignItems="center" gap="var(--space-2xs)">
              <Typography variant="h5" lineHeight={1}>
                Drag and drop file or <Link>Browse</Link>
              </Typography>
              <Typography variant="body2" color="var(--color-text-secondary)">
                Supports JSON and CSV files
              </Typography>
            </Stack>
          </Stack>
        )}
      </div>
      <style jsx>{`
        .zone {
          display: flex;
          position: relative;
          align-items: center;
          justify-content: center;
          width: 100%;
          border-radius: 5px;
          border: 2px dashed rgba(212, 133, 36, 0.412);
          background-color: rgba(212, 133, 36, 0.022);
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          z-index: 10;
          cursor: pointer;
        }

        .icon {
          background-color: rgba(212, 133, 36, 0.212);
          border-radius: 50%;
          width: 37px;
          height: 37px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default UploadZone;
