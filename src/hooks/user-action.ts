export const useRejectFollowRequestAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['rejectFollowRequest', userId],
    mutationFn: () => api.request('following/requests/reject', { userId }),
  });
};

export const useAcceptFollowRequestAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['acceptFollowRequest', userId],
    mutationFn: () => api.request('following/requests/accept', { userId }),
  });
};

export const useCancelFollowRequestAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['cancelFollowRequest', userId],
    mutationFn: () => api.request('following/requests/cancel', { userId }),
  });
};

export const useFollowAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['follow', userId],
    mutationFn: () => api.request('following/create', { userId }),
  });
};

export const useUnfollowAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['unfollow', userId],
    mutationFn: () => api.request('following/delete', { userId }),
  });
};

export const useBlockAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['block', userId],
    mutationFn: () => api.request('blocking/create', { userId }),
  });
};

export const useUnblockAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['unblock', userId],
    mutationFn: () => api.request('blocking/delete', { userId }),
  });
};

export const useMuteAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['mute', userId],
    mutationFn: (expiresAt: number | null) => api.request('mute/create', { userId, expiresAt }),
  });
};

export const useUnmuteAction = (userId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['unmute', userId],
    mutationFn: () => api.request('mute/delete', { userId }),
  });
};
