import { Stack } from '@mui/system';
import React, { FC, Key } from 'react';
import Logo from '../global/Logo';
import SidebarLinkGroup from './SidebarLinkGroup';

export interface SidebarLink {
  key: Key;
  name: string;
  href: string;
}

export interface SidebarLinkGroups {
  name: string;
  links: SidebarLink[];
}

export interface SidebarProps {
  links: SidebarLinkGroups[];
}

const Sidebar: FC<SidebarProps> = ({ links, ...props }) => {
  return (
    <>
      <nav className="sidebar">
        <Logo />

        <Stack>
          {links.map((group) => (
            <SidebarLinkGroup key={group.name} name={group.name} links={group.links} />
          ))}
        </Stack>
      </nav>

      <style jsx>{`
        .sidebar {
          height: 100%;
          background-color: var(--color-surface);
          width: 220px;
          padding: var(--space-sm);
        }
      `}</style>
    </>
  );
};

export default Sidebar;
