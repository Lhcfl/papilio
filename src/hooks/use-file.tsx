/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { misskeyApi } from '@/services/inject-misskey-api';
import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';

export const usePermanentlyDeleteFileAction = (id: string) =>
  useMutation({
    mutationKey: ['permanently-delete-file', id],
    mutationFn: () => misskeyApi('drive/files/delete', { fileId: id }).then(() => ({ ok: true })),
  });

export const useUpdateFileAction = (id: string) =>
  useMutation({
    mutationKey: ['update-file', id],
    mutationFn: (data: { comment?: string; folderId?: string | null; isSensitive?: boolean; name?: string }) =>
      misskeyApi('drive/files/update', { fileId: id, ...data }),
  });

export const fileQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['file', id],
    queryFn: () => misskeyApi('drive/files/show', { fileId: id }),
  });

export const useFileQuery = (id: string) => useQuery(fileQueryOptions(id));
