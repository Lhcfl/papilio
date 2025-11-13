/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MeDetailed } from 'misskey-js/entities.js';
import { createContext, use, useMemo } from 'react';

export const MeContext = createContext<MeDetailed | null>(null);

export function useMe(): MeDetailed;
export function useMe<T>(selector: (m: MeDetailed) => T): T | undefined;
export function useMe<T>(selector?: (m: MeDetailed) => T) {
  return useMemo(() => {
    const me = use(MeContext);
    if (me == null) throw new Error('MeContext is not provided!');
    return selector ? selector(me) : me;
  }, [selector]);
}
