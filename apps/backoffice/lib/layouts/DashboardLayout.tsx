import React, { FC, PropsWithChildren } from 'react';
import Footer from '../components/global/Footer';
import Sidebar from '../components/sidebar/Sidebar';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DashboardLayoutProps extends PropsWithChildren {}

const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  return (
    <>
      <div className="layout">
        <div className="body">{props.children}</div>
        <Footer />
      </div>

      <style jsx>{`
        .layout {
          // display: grid;
          // grid-template-columns: auto 1fr;
          display: grid;
          grid-template-rows: 1fr auto;
          height: 100%;
        }

        .body {
          height: 100%;
        }
      `}</style>
    </>
  );
};

export default DashboardLayout;
