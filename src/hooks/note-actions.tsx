/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { misskeyApi, type EndpointParamType } from '@/lib/inject-misskey-api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { markAsChanged, patchNote } from '@/hooks/use-note';
import { meopt } from '@/loaders/me-loader';
import { getAcctUserQueryOptions } from '@/hooks/use-user';
import { useMe } from '@/stores/me';

export const useRenoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['renote', noteId],
    mutationFn: (props: Omit<EndpointParamType<'notes/create'>, 'renoteId'>) =>
      misskeyApi('notes/create', { renoteId: noteId, ...props }),
    // renote and unrenote in some version of misskey/sharekey sometimes returns a wrong number of renotes
    // so we just mark the note as changed to refetch it on success.
    onSuccess: () => {
      markAsChanged(noteId);
    },
  });

export const useUnrenoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['unrenote', noteId],
    mutationFn: () => misskeyApi('notes/unrenote', { noteId }),
    onSuccess: () => {
      markAsChanged(noteId);
    },
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
    onMutate: () => {
      markAsChanged(noteId);
    },
  });
export const useUndoReactNoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['undoReactNote', noteId],
    mutationFn: () => misskeyApi('notes/reactions/delete', { noteId }),
    onMutate: () => {
      markAsChanged(noteId);
    },
  });

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

export const useNoteVoteAction = (noteId: string) =>
  useMutation({
    mutationKey: ['noteVote', noteId],
    mutationFn: (choice: number) => misskeyApi('notes/polls/vote', { noteId, choice }),
    // pollVoted is a event that misskey/sendkey sends when a vote is successful.
    onMutate: () => {
      markAsChanged(noteId);
    },
  });

export const useNotePollRefreshAction = (noteId: string) =>
  useMutation({
    mutationKey: ['notePollRefresh', noteId],
    mutationFn: () => misskeyApi('notes/polls/refresh', { noteId }),
    onSuccess: () => {
      markAsChanged(noteId);
    },
  });

export const useNotePinAction = (noteId: string) => {
  const me = useMe();
  return useMutation({
    mutationKey: ['notePin', noteId],
    mutationFn: () => misskeyApi('i/pin', { noteId }),
    onSuccess: (_0, _1, _2, ctx) => {
      void ctx.client.refetchQueries(meopt);
      void ctx.client.invalidateQueries(getAcctUserQueryOptions(me));
    },
  });
};

export const useNoteUnpinAction = (noteId: string) => {
  const me = useMe();
  return useMutation({
    mutationKey: ['noteUnpin', noteId],
    mutationFn: () => misskeyApi('i/unpin', { noteId }),
    onSuccess: (_0, _1, _2, ctx) => {
      void ctx.client.refetchQueries(meopt);
      void ctx.client.invalidateQueries(getAcctUserQueryOptions(me));
    },
  });
};
