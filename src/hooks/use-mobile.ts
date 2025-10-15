import { useMedia } from 'react-use';

export function useIsMobile() {
  return useMedia(`(max-width: 48rem)`, false);
}
