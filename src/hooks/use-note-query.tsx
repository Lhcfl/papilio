import { injectMisskeyApi } from '@/services/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';
import { registerNote } from './use-note';

export const useNoteQuery = (noteId: string) => {
  const api = injectMisskeyApi();
  const data = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => api.request('notes/show', { noteId }).then((note) => registerNote([note])[0]),
  });
  return data;
};
