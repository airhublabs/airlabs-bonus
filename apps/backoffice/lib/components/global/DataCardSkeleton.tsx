import { Skeleton, Typography } from '@mui/material';
import React, { FC } from 'react';

const DataCardSkeleton = ({ ...props }) => {
  return (
    <>
      <div className="data-card">
        <Skeleton width='9rem' />
        <Skeleton width='3rem' />
      </div>

      <style jsx>{`
        .data-card {
          padding: var(--space-sm);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: var(--space-2xs);
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

DataCardSkeleton.defaultProps = {};

export default DataCardSkeleton;
