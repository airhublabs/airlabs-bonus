import { useContext } from 'react';
import { AlertContext } from '../providers/AlertProvider';

export const useAlerts = () => {
  const alertContext = useContext(AlertContext);

  return alertContext;
};
