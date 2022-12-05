import { DangerZonesApi } from '@airlabs-bonus/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from '../airlabs.api';

export const useListDangerZones = (options?: UseQueryOptions<DangerZonesApi.ListResponseBody>) => {
  const fetchDangerZones = async () => (await api.dangerZones.list()).data;

  const dangerZonesQuery = useQuery({
    queryKey: ['zones'],
    queryFn: fetchDangerZones,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    ...options,
  });

  return dangerZonesQuery;
};
