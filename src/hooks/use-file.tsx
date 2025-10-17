import { misskeyApi } from '@/services/inject-misskey-api';
import { useMutation } from '@tanstack/react-query';

export const usePermanentlyDeleteFileAction = (id: string) =>
  useMutation({
    mutationKey: ['permanently-delete-file', id],
    mutationFn: () => misskeyApi('drive/files/delete', { fileId: id }).then(() => ({ ok: true })),
  });
