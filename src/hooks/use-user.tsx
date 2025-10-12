export const useUserQuery = (userId: string) =>
  useQuery({
    queryKey: ['user', userId],
    queryFn: () => injectMisskeyApi().request('users/show', { userId }),
  });
