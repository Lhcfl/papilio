/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';
import { registerNote } from '@/hooks/use-note';

export const noteQueryOptions = (noteId: string) => ({
  queryKey: ['note', noteId],
  queryFn: () =>
    injectMisskeyApi()
      .request('notes/show', { noteId })
      .then((note) => registerNote([note])[0]),
  staleTime: 1000 * 60 * 60, // 1 hour
});

export const useNoteQuery = (noteId: string) => useQuery(noteQueryOptions(noteId));
