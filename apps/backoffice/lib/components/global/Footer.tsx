import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import Link from 'next/link';
import React, { FC } from 'react';

export interface FooterProps {}

const Footer: FC<FooterProps> = (props) => {
  return (
    <>
      <footer>
        <Stack component="footer" direction="row" justifyContent="space-between">
          <Typography variant="caption" color="var(--color-text-secondary)">
            Copyright Airlabs LLC 2022
          </Typography>

          <Link href="/" style={{ textDecoration: 'none' }}>
            <Typography
              variant="caption"
              color="var(--color-text-secondary)"
              sx={{ ':hover': { color: 'var(--color-heading)' } }}
            >
              <span className="home">Home</span>
            </Typography>
          </Link>
        </Stack>
      </footer>
      <style jsx>{`
        footer {
          padding: var(--space-2xs) var(--space-sm);
        }
      `}</style>
    </>
  );
};

Footer.defaultProps = {};

export default Footer;
