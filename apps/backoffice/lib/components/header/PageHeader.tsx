import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Breadcrumbs, IconButton, Link, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

export interface PageHeaderProps {
  actions?: ReactNode;
  title: string;
  breadcrumbLinks: { name: string; href?: string }[];
}

const PageHeader: FC<PageHeaderProps> = ({ actions, title, breadcrumbLinks, ...props }) => {
  const router = useRouter();

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        bgcolor="#F5F8FA"
        p="var(--space-3xs) var(--space-xs)"
      >
        <Stack>
          <Stack direction="row" alignItems="center">
            <IconButton
              size="small"
              style={{ marginLeft: '-10px' }}
              onClick={() => router.push('/')}
            >
              <ArrowBackRoundedIcon />
            </IconButton>
            <Typography variant="h4">{title}</Typography>
          </Stack>

          {breadcrumbLinks && (
            <Breadcrumbs>
              {breadcrumbLinks.map((breadcrumb, i) =>
                i === breadcrumbLinks.length - 1 ? (
                  <Typography key="name">{breadcrumb.name}</Typography>
                ) : (
                  <Link underline="hover" color="inherit" href={breadcrumb.href} key="name">
                    {breadcrumb.name}
                  </Link>
                )
              )}
            </Breadcrumbs>
          )}
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
