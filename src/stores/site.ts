/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Merge } from '@/types/utils';
import type { MetaDetailed as SkMetaDetailed } from '@@/sharkey-js/entities';
import type { MetaDetailed as MkMetaDetailed } from 'misskey-js/entities.js';
import { createContext, use, useMemo } from 'react';

type MetaDetailed = Merge<MkMetaDetailed, SkMetaDetailed>;

export const SiteMetaContext = createContext<MetaDetailed | null>(null);

export function useSiteMeta<T>(selector: (arg: MetaDetailed) => T): T {
  return useMemo(() => {
    const meta = use(SiteMetaContext);
    if (meta == null) throw new Error('SiteMetaContext is not provided!');
    return selector(meta);
  }, [selector]);
}

export function useNullableSiteMeta<T>(selector: (arg: MetaDetailed) => T): T | null {
  return useMemo(() => {
    const meta = use(SiteMetaContext);
    if (meta == null) return null;
    return selector(meta);
  }, [selector]);
}
