import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { Breadcrumbs, IconButton, Link, Typography, TypographyProps } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';

export interface PageHeaderProps {
  actions?: ReactNode;
  title: string;
  breadcrumbLinks: { name: string; href?: string }[];
  bgcolor?: string;
  padding?: number | string;
  titleVariant?: TypographyProps['variant'];
}

const PageHeader: FC<PageHeaderProps> = ({
  actions,
  title,
  breadcrumbLinks,
  bgcolor = '#F5F8FA',
  titleVariant = 'h4',
  padding = 'var(--space-3xs) var(--space-xs)',
  ...props
}) => {
  const router = useRouter();

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        bgcolor={bgcolor}
        p={padding}
      >
        <Stack>
          <Stack>
            <Stack direction="row" alignItems="center">
              <IconButton
                size="small"
                style={{ marginLeft: '-10px' }}
                onClick={() => router.push('/')}
              >
                <ArrowBackRoundedIcon />
              </IconButton>
              <Typography variant={titleVariant}>{title}</Typography>
            </Stack>
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
