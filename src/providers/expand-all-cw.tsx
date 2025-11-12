import { createContext } from 'react';

export const NoteDefaultStateContext = createContext<{
  expandAllCw: boolean;
}>({
  expandAllCw: false,
});
