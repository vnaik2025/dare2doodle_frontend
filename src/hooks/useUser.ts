// src/hooks/useUser.ts
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../apis/usersApi';
import type { User } from '../apis/usersApi';

export const useUser = (userId?: string) => {
  return useQuery<User>({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId!),
    enabled: !!userId, // only fetch if we have an id
  });
};
