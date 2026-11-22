import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useMyProfile() {
  return useQuery({
    queryKey: ['myProfile'],
    queryFn: () => api.myProfile(),
    retry: false,
  });
}

export function usePublicProfile(id) {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => api.publicProfile(id),
    enabled: !!id,
  });
}
