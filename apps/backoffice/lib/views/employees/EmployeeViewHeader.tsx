import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { FC } from 'react';

export interface EmployeeViewHeaderProps {
  name: string;
  employeeNumber: string;
  homebase: string;
  brq: string;
}

const EmployeeViewHeader: FC<EmployeeViewHeaderProps> = ({
  name,
  brq,
  employeeNumber,
  homebase,
}) => {
  return (
    <>
      <header>
        <Stack direction="row" justifyContent="space-between">
          <DataPoint label="Name" value={name} />
          <DataPoint label="EmpNo" value={employeeNumber} />
          <DataPoint label="Homebase" value={homebase} />
          <DataPoint label="BRQ" value={brq} />
        </Stack>
      </header>

      <style jsx>{`
        header {
          width: 100%;
        }
      `}</style>
    </>
  );
};

const DataPoint = ({ label, value }: { label: string; value: string }) => {
  return (
    <Stack>
      <Typography variant="subtitle1" color="GrayText">
        {label}
      </Typography>
      <Typography fontWeight={600}>{value}</Typography>
    </Stack>
  );
};

export default EmployeeViewHeader;
