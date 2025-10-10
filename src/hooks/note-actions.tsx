export const useRenoteAction = (noteId: string) => {
  const api = useMisskeyApi()
  return useMutation({
    mutationKey: ['renote', noteId],
    mutationFn: (visibility: 'public' | 'home' | 'followers') =>
      api.request('notes/create', { renoteId: noteId, visibility }),
  })
}

export const useUnrenoteAction = (noteId: string) => {
  const api = useMisskeyApi()
  return useMutation({
    mutationKey: ['unrenote', noteId],
    mutationFn: () => api.request('notes/unrenote', { noteId }),
  })
}

export const useDeleteNoteAction = (noteId: string) => {
  const api = useMisskeyApi()
  return useMutation({
    mutationKey: ['deleteNote', noteId],
    mutationFn: () => api.request('notes/delete', { noteId }),
  })
}

export const useReactNoteAction = (noteId: string) => {
  const api = useMisskeyApi()
  return useMutation({
    mutationKey: ['reactNote', noteId],
    mutationFn: (reaction: string) => api.request('notes/reactions/create', { noteId, reaction }),
  })
}

export const useUndoReactNoteAction = (noteId: string) => {
  const api = useMisskeyApi()
  return useMutation({
    mutationKey: ['undoReactNote', noteId],
    mutationFn: () => api.request('notes/reactions/delete', { noteId }),
  })
}

type RestArgumentsOf<T> = T extends (arg0: never, ...args: infer U) => unknown ? U : never

// Like is a special reaction
export const useLikeNoteAction = (noteId: string) => {
  const res = useReactNoteAction(noteId)
  return {
    ...res,
    mutate: (...args: RestArgumentsOf<typeof res.mutate>) => res.mutate('❤️', ...args),
  }
}
