import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useJobs(params = {}) {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => api.jobs(params),
    staleTime: 60_000,
  });
}

export function useJob(id) {
  return useQuery({
    queryKey: ['job', id],
    queryFn: () => api.job(id),
    enabled: !!id,
  });
}

export function useDistricts() {
  return useQuery({
    queryKey: ['districts'],
    queryFn: () => api.districts(),
    staleTime: Infinity,
  });
}
