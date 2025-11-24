/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { misskeyApi } from '@/lib/inject-misskey-api';
import { queryClient } from '@/plugins/persister';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import type { DriveFile } from '@/types/drive-file';
import { queryOptions, useMutation } from '@tanstack/react-query';
import { EyeIcon, EyeOffIcon, Trash2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    onSuccess(data, _1, _2, context) {
      context.client.setQueryData(fileQueryOptions(id).queryKey, data);
    },
  });

export const useMarkAsSensitive = (id: string) => {
  const { mutateAsync } = useUpdateFileAction(id);
  const { t } = useTranslation();
  return useAfterConfirm(
    {
      title: t('markAsSensitive'),
      description: t('markAsSensitiveConfirm'),
      confirmIcon: <EyeOffIcon />,
      variant: 'destructive',
    },
    () => mutateAsync({ isSensitive: true }),
  );
};

export const useMarkAsNotSensitive = (id: string) => {
  const { mutateAsync } = useUpdateFileAction(id);
  const { t } = useTranslation();
  return useAfterConfirm(
    {
      title: t('unmarkAsSensitive'),
      description: t('unmarkAsSensitiveConfirm'),
      confirmIcon: <EyeIcon />,
    },
    () => mutateAsync({ isSensitive: false }),
  );
};

export const fileQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['file', id],
    queryFn: () => misskeyApi('drive/files/show', { fileId: id }) as Promise<DriveFile>,
    staleTime: Infinity,
  });

export const setFileQueryData = (file: DriveFile) => {
  queryClient.setQueryData(fileQueryOptions(file.id).queryKey, file);
};

export function usePermanentlyDeleteFileWithConfirmAction(id: string, name: string, after?: () => unknown) {
  const { t } = useTranslation();
  const { mutateAsync: permanentlyDelete } = usePermanentlyDeleteFileAction(id);
  return useAfterConfirm(
    {
      title: t('areYouSure'),
      description: t('driveFileDeleteConfirm', { name }),
      confirmIcon: <Trash2Icon />,
      confirmText: t('deleteFile'),
      variant: 'destructive',
    },
    async () => {
      await permanentlyDelete();
      after?.();
    },
  );
}
