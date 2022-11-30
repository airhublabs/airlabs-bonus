import React, { FC, PropsWithChildren } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashboardLayoutProps extends PropsWithChildren {}

const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  return (
    <>
      <div className="layout">
        <div className="body">{props.children}</div>
      </div>

      <style jsx>{`
        .layout {
          // TODO: Remove, unsued. Sidebar is not needed
          // display: grid;
          // grid-template-columns: auto 1fr;
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default DashboardLayout;
