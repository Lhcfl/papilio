export const useRejectFollowRequestAction = (userId: string) => {
  const api = injectMisskeyApi()
  return useMutation({
    mutationKey: ['rejectFollowRequest', userId],
    mutationFn: () => api.request('following/requests/reject', { userId }),
  })
}

export const useAcceptFollowRequestAction = (userId: string) => {
  const api = injectMisskeyApi()
  return useMutation({
    mutationKey: ['acceptFollowRequest', userId],
    mutationFn: () => api.request('following/requests/accept', { userId }),
  })
}

export const useCancelFollowRequestAction = (userId: string) => {
  const api = injectMisskeyApi()
  return useMutation({
    mutationKey: ['cancelFollowRequest', userId],
    mutationFn: () => api.request('following/requests/cancel', { userId }),
  })
}
