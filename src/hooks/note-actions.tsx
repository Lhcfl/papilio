import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

export const useRenoteAction = (noteId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['renote', noteId],
    mutationFn: (visibility: 'public' | 'home' | 'followers') =>
      api.request('notes/create', { renoteId: noteId, visibility }),
  });
};

export const useUnrenoteAction = (noteId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['unrenote', noteId],
    mutationFn: () => api.request('notes/unrenote', { noteId }),
  });
};

export const useDeleteNoteAction = (noteId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['deleteNote', noteId],
    mutationFn: () => api.request('notes/delete', { noteId }),
  });
};

export const useReactNoteAction = (noteId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['reactNote', noteId],
    mutationFn: (reaction: string) => api.request('notes/reactions/create', { noteId, reaction }),
  });
};

export const useUndoReactNoteAction = (noteId: string) => {
  const api = injectMisskeyApi();
  return useMutation({
    mutationKey: ['undoReactNote', noteId],
    mutationFn: () => api.request('notes/reactions/delete', { noteId }),
  });
};

type RestArgumentsOf<T> = T extends (arg0: never, ...args: infer U) => unknown ? U : never;

// Like is a special reaction
export const useLikeNoteAction = (noteId: string) => {
  const res = useReactNoteAction(noteId);
  return {
    ...res,
    mutate: (...args: RestArgumentsOf<typeof res.mutate>) => res.mutate('❤️', ...args),
  };
};

export const useTranslateAction = (noteId: string) => {
  const api = injectMisskeyApi();
  const { i18n } = useTranslation();
  return useMutation({
    mutationKey: ['translateNote', noteId],
    mutationFn: () => api.request('notes/translate', { noteId, targetLang: i18n.language }),
  });
};
