import { IconButton, TextField } from '@mui/material';
import { Stack } from '@mui/system';
import React, { FC, FocusEvent, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

export interface ListTextFieldProps {
  value: string;
  onDelete: () => void;
  onBlur: (value: string) => void;
}

const ListTextField: FC<ListTextFieldProps> = ({ value, onDelete, onBlur }) => {
  const [inputValue, setInputValue] = useState('');

  const onInputBlur = (event: FocusEvent) => {
    onBlur && onBlur(inputValue);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <>
      <Stack direction="row" alignItems="center" gap="var(--space-xs)">
        <TextField
          fullWidth
          variant="outlined"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={onInputBlur}
        />
        <IconButton onClick={() => onDelete()}>
          <DeleteIcon />
        </IconButton>
      </Stack>
      <style jsx>{``}</style>
    </>
  );
};

ListTextField.defaultProps = {};

export default ListTextField;
