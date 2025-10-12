import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';

export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: () => injectMisskeyApi().request('users/show', { userId }),
  });
