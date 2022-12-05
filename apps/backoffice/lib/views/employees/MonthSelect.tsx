import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select/SelectInput';
import { FC } from 'react';

export interface MonthSelectProps {
  onChange: (params: { value: number; label: string }) => void;
  month: number;
}

const MONTHS: { label: string; value: number }[] = [
  { label: 'January', value: 1 },
  { label: 'Feburary', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'Augest', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

const MonthSelect: FC<MonthSelectProps> = ({ month, ...props }) => {

  const onSelectChange = (event: SelectChangeEvent<number>, child) => {
    const value = event.target.value as number;

    props.onChange &&
      props.onChange({
        value: value,
        label: MONTHS.find((month) => month.value === event.target.value).label,
      });
  };

  return (
    <>
      <FormControl>
        <InputLabel id="month-select">Month</InputLabel>
        <Select labelId="month-select" value={month} label="Month" onChange={onSelectChange}>
          {MONTHS.map((month) => (
            <MenuItem value={month.value} key={month.value}>
              {month.label.slice(0, 3)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <style jsx>{``}</style>
    </>
  );
};

MonthSelect.defaultProps = {};

export default MonthSelect;
