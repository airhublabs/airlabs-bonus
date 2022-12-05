import React, { FC, PropsWithChildren, useEffect } from 'react';
import classNames from 'classnames';
import { useAlerts } from '../../hooks/useAlerts';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Alert, AlertTitle, IconButton, Snackbar } from '@mui/material';

export interface AlertContainerProps {
  xLocation: 'left' | 'right' | 'center';
}

const AlertContainer: FC<AlertContainerProps> = ({ xLocation, ...props }) => {
  const alerts = useAlerts();

  useEffect(() => {
    console.log('Listing alerts', alerts?.alerts);
  }, [alerts?.alerts]);

  return (
    <>
      <div className={classNames('alert-container', `x-location--${xLocation}`)}>
        <Snackbar open={true} autoHideDuration={300}>
          <div>
            {alerts.alerts &&
              alerts.alerts.map((alert, i) => (
                <Alert
                  elevation={1}
                  severity={alert.status}
                  title={alert?.title}
                  key={i}
                  style={{ alignItems: 'center' }}
                  action={
                    <IconButton size="small" onClick={() => alerts.removeAlert(alert.key)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  }
                >
                  {alert?.title && <AlertTitle>{alert.title}</AlertTitle>}
                  {alert.message}
                </Alert>
              ))}
          </div>
        </Snackbar>
      </div>
      {/* <Snackbar message="Something happened" open={true} autoHideDuration={6000} /> */}

      <style jsx>{`
        .alert-container {
          display: flex;
          flex-direction: column;
          gap: var(--space-2xs);
          position: fixed;
          z-index: 10;
          bottom: var(--space-sm);
        }

        .x-location {
          &--left {
            left: var(--space-sm);
          }

          &--right {
            right: var(--space-sm);
          }

          &--left {
            left: 50%;
            transform: translateX(-50%);
          }
        }
      `}</style>
    </>
  );
};

export default AlertContainer;
