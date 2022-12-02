import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '../../constants/query-key.constant';
import api from '../airlabs.api';

export const useListEmployees = () => {
  const employeeQuery = useQuery({
    queryKey: QUERY_KEY.listEmployees,
    queryFn: async () => (await api.employees.list()).data,
    onSuccess: console.log,
  });

  return employeeQuery;
};

export const useRetriveEmployee = (employeeId: number) => {
  const fetchFunction = async () => (await api.employees.retrive(employeeId)).data;

  const employeeQuery = useQuery({
    queryKey: QUERY_KEY.listEmployees,
    queryFn: fetchFunction,
    enabled: !!employeeId,
  });

  return employeeQuery;
};
