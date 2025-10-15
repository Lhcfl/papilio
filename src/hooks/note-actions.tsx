import { misskeyApi } from '@/services/inject-misskey-api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { patchNote } from './use-note';

export const useRenoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['renote', noteId],
    mutationFn: (visibility: 'public' | 'home' | 'followers') =>
      misskeyApi('notes/create', { renoteId: noteId, visibility }),
  });

export const useUnrenoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['unrenote', noteId],
    mutationFn: () => misskeyApi('notes/unrenote', { noteId }),
  });

export const useDeleteNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['deleteNote', noteId],
    mutationFn: () => misskeyApi('notes/delete', { noteId }),
    onSuccess: () => {
      patchNote(noteId, { isDeleted: true });
    },
  });

export const useReactNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['reactNote', noteId],
    mutationFn: (reaction: string) => misskeyApi('notes/reactions/create', { noteId, reaction }),
  });
export const useUndoReactNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['undoReactNote', noteId],
    mutationFn: () => misskeyApi('notes/reactions/delete', { noteId }),
  });

type RestArgumentsOf<T> = T extends (arg0: never, ...args: infer U) => unknown ? U : never;

// Like is a special reaction
export const useLikeNoteAction = (noteId: string) => {
  const res = useReactNoteAction(noteId);
  return {
    ...res,
    mutate: (...args: RestArgumentsOf<typeof res.mutate>) => {
      res.mutate('❤️', ...args);
    },
  };
};

export const useTranslateAction = (noteId: string) => {
  const { i18n } = useTranslation();
  return useMutation({
    mutationKey: ['translateNote', noteId],
    mutationFn: () => misskeyApi('notes/translate', { noteId, targetLang: i18n.language }),
  });
};

export const useFavoriteNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['favoriteNote', noteId],
    mutationFn: () => misskeyApi('notes/favorites/create', { noteId }),
    onSuccess: () => {
      patchNote(noteId, { isFavorited: true });
    },
  });

export const useUnfavoriteNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['unfavoriteNote', noteId],
    mutationFn: () => misskeyApi('notes/favorites/delete', { noteId }),
    onSuccess: () => {
      patchNote(noteId, { isFavorited: false });
    },
  });

export const useClipNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['clipNote', noteId],
    mutationFn: (clipId: string) => misskeyApi('clips/add-note', { clipId, noteId }),
  });

export const useUnclipNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['unclipNote', noteId],
    mutationFn: (clipId: string) => misskeyApi('clips/remove-note', { clipId, noteId }),
  });

export const useThreadMuteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['threadMute', noteId],
    mutationFn: () => misskeyApi('notes/thread-muting/create', { noteId }),
    onSuccess: () => {
      patchNote(noteId, { isMutingThread: true });
    },
  });

export const useThreadUnmuteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['threadUnmute', noteId],
    mutationFn: () => misskeyApi('notes/thread-muting/delete', { noteId }),
    onSuccess: () => {
      patchNote(noteId, { isMutingThread: false });
    },
  });
