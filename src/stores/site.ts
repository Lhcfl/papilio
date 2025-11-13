/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { MetaLite } from 'misskey-js/entities.js';
import { createContext, use, useMemo } from 'react';

export const SiteMetaContext = createContext<MetaLite | null>(null);

export function useSiteMeta<T>(selector: (arg: MetaLite) => T): T {
  return useMemo(() => {
    const meta = use(SiteMetaContext);
    if (meta == null) throw new Error('SiteMetaContext is not provided!');
    return selector(meta);
  }, [selector]);
}
