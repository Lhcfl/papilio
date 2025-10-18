/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect, useState } from 'react';
import * as IDB from 'idb-keyval';
import { getCurrentUserSiteIDB } from '@/plugins/idb';
import { useDebounce } from 'react-use';
import type { DriveFile, User } from 'misskey-js/entities.js';
import { deepEqual } from '@/lib/object';
import { toast } from 'sonner';

export interface DraftKeyProps {
  replyId?: string | null;
  quoteId?: string | null;
  editId?: string | null;
}

export const getDraftKey = (props: DraftKeyProps) => {
  const ret = ['draft'];
  if (props.replyId) ret.push(`reply/${props.replyId}`);
  if (props.quoteId) ret.push(`quote/${props.quoteId}`);
  if (props.editId) ret.push(`edit/${props.editId}`);
  return ret.join('::');
};

const DefaultDraftData = {
  visibility: 'public' as 'public' | 'home' | 'followers' | 'specified',
  visibleUsers: [] as User[],
  reactionAcceptance: null as
    | null
    | 'likeOnly'
    | 'likeOnlyForRemote'
    | 'nonSensitiveOnly'
    | 'nonSensitiveOnlyForLocalLikeOnlyForRemote',
  files: [] as DriveFile[],
  mediaIds: [] as string[],
  poll: null as {
    choices: string[];
    multiple?: boolean;
    expiresAt?: number | null;
    expiredAfter?: number | null;
  } | null,
  localOnly: false,
  text: '',
  cw: '',
  hasCw: false,
  showPreview: false,
};

export type DraftData = typeof DefaultDraftData;

export const useDraft = (
  draftKey: string,
  defaults?: Partial<DraftData>,
  opts?: {
    onFirstLoad?: (data: DraftData) => void;
  },
) => {
  const defaultsWithFallback = { ...DefaultDraftData };

  for (const k of Object.keys(DefaultDraftData) as (keyof DraftData)[]) {
    if (defaults?.[k]) {
      defaultsWithFallback[k] = defaults[k] as never;
    }
  }

  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(defaultsWithFallback);

  const update = (data: Partial<DraftData>) => {
    setDraft((d) => ({ ...d, ...data }));
  };

  const remove = () => {
    void IDB.del(draftKey, getCurrentUserSiteIDB());
  };

  const resetExcept = (keys: (keyof DraftData)[]) => {
    setDraft((d) => {
      const res = {} as DraftData;
      for (const k of Object.keys(DefaultDraftData) as (keyof DraftData)[]) {
        if (keys.includes(k)) {
          res[k] = d[k] as never;
        } else {
          res[k] = defaultsWithFallback[k] as never;
        }
      }
      return res;
    });
  };

  useEffect(() => {
    const idbStore = getCurrentUserSiteIDB();

    IDB.get(draftKey, idbStore)
      .then((data) => {
        function hasData(d: typeof data): d is DraftData {
          return !!d;
        }

        let d = draft;
        if (hasData(data)) {
          d = { ...defaultsWithFallback, ...data };
          setDraft(d);
        }
        opts?.onFirstLoad?.(d);
        setLoading(false);
      })
      .catch((e: unknown) => {
        console.error(e);
        setLoading(false);
        toast.error('Failed to load draft from IndexedDB. This should not happen. Please report this bug.');
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey, ...Object.values(defaultsWithFallback)]);

  useDebounce(
    () => {
      const idbStore = getCurrentUserSiteIDB();
      if (deepEqual(draft, defaultsWithFallback)) {
        remove();
      } else {
        void IDB.set(draftKey, draft, idbStore);
      }
    },
    300,
    [draft],
  );

  return loading ? null : { ...draft, update, remove, resetExcept };
};
