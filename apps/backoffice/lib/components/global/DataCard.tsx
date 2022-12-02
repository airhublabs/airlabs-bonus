import { Typography } from '@mui/material';
import React, { FC } from 'react';
import DataCardSkeleton from './DataCardSkeleton';

export interface DataCardProps {
  title: string;
  value: string | number;
  isLoading?: boolean;
}

const DataCard: FC<DataCardProps> = ({ title, value, isLoading = false, ...props }) => {

  if (isLoading) return <DataCardSkeleton />

  return (
    <>
      <div className="data-card">
        <Typography variant="body1" sx={{ color: 'var(--color-text)' }}>
          {title}
        </Typography>
        <Typography variant="h2" fontWeight={400}>{value}</Typography>
      </div>

      <style jsx>{`
        .data-card {
          padding: var(--space-sm);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: var(--space-3xs);
          width: 100%;
          border: 1px solid var(--neutral-400);

          &__title {
          }
          &__value {
          }
        }
      `}</style>
    </>
  );
};

DataCard.defaultProps = {};

export default DataCard;
