import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import {
  Breadcrumbs, IconButton,
  Link,
  Typography
} from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

export interface PageHeaderProps {
  actions?: ReactNode;
}

const PageHeader: FC<PageHeaderProps> = ({ actions, ...props }) => {
  const router = useRouter();

  return (
    <>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack>
          <Stack direction="row" alignItems="center">
            <IconButton
              size="small"
              style={{ marginLeft: '-10px' }}
              onClick={() => router.push('/')}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography variant="h4">Employee</Typography>
          </Stack>
          <Breadcrumbs>
            <Link underline="hover" color="inherit" href="/">
              Home
            </Link>
            <Typography>Adam</Typography>
          </Breadcrumbs>
        </Stack>

        {actions && (
          <Stack direction="row" gap="var(--space-xs)">
            {actions}
          </Stack>
        )}
      </Stack>
      <style jsx>{``}</style>
    </>
  );
};

PageHeader.defaultProps = {};

export default PageHeader;
