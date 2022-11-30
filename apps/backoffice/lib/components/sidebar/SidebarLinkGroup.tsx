import { Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { FC } from 'react';
import { SidebarLink } from './Sidebar';

export interface SidebarLinkGroupProps {
  name: string;
  links: SidebarLink[];
}

const SidebarLinkGroup: FC<SidebarLinkGroupProps> = ({ links, name }) => {
  return (
    <>
      <Stack>
        <Typography variant="h5">{name}</Typography>
        {links.map((link) => (
          <a key={link.key} href={link.href}>
            {link.name}
          </a>
        ))}
      </Stack>

      <style jsx>{``}</style>
    </>
  );
};

SidebarLinkGroup.defaultProps = {};

export default SidebarLinkGroup;
