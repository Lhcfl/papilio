import { misskeyApi } from '@/services/inject-misskey-api';
import { useMutation } from '@tanstack/react-query';

export const useCreateNewClipAction = () =>
  useMutation({
    mutationKey: ['clips/create'],
    mutationFn: (props: { name: string; description: string; isPublic: boolean }) => misskeyApi('clips/create', props),
    onSuccess: (_1, _2, _3, ctx) => {
      void ctx.client.refetchQueries({ queryKey: ['clips'] });
    },
  });
