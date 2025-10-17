import { misskeyApi } from '@/services/inject-misskey-api';
import { useMutation, useQuery } from '@tanstack/react-query';

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

export const useFileQuery = (id: string) =>
  useQuery({
    queryKey: ['file', id],
    queryFn: () => misskeyApi('drive/files/show', { fileId: id }),
  });
