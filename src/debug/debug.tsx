import { useEffect } from 'react';

/* eslint-disable react-hooks/rules-of-hooks */
const DEBUG_CONFIG = {
  enable_rerender_log: false,
};

export function useDebugger(...args: unknown[]) {
  if (import.meta.env.DEV) {
    useEffect(() => {
      if (DEBUG_CONFIG.enable_rerender_log) {
        console.log('[DEBUG] rerendered: ', ...args);
      }
    });
  }
}
