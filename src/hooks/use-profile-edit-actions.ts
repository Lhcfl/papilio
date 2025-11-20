import { sharkeyApi } from '@/lib/inject-misskey-api';
import type { SkEndpoints } from '@/types/sharkey-api';
import { useMutation } from '@tanstack/react-query';

export const useProfileEditAction = () =>
  useMutation({
    mutationKey: ['i/update'],
    mutationFn: (data: SkEndpoints['i/update']['req']) => sharkeyApi('i/update', data),
  });
