/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect } from 'react';

const DEBUG_CONFIG = {
  enable_rerender_log: false,
};

let useDebugger: (...args: unknown[]) => void;

if (import.meta.env.DEV) {
  useDebugger = (...args: unknown[]) => {
    useEffect(() => {
      if (DEBUG_CONFIG.enable_rerender_log) {
        console.log('[DEBUG] rerendered: ', ...args);
      }
    });
  };
} else {
  // eslint-disable-next-line react-x/no-unnecessary-use-prefix
  useDebugger = () => null;
}

export { useDebugger };
