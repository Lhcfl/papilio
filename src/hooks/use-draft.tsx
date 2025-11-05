/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect, useMemo, useState } from 'react';
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
  poll: {
    choices: ['', ''] as string[],
    multiple: false,
    expiresAt: null as number | null,
    expiredAfter: (3 * 24 * 60 * 60 * 1000) as number | null, // default to 3 days
  },
  showPoll: false,
  localOnly: false,
  text: '',
  cw: '',
  hasCw: false,
  showPreview: false,
};

export type DraftData = typeof DefaultDraftData;

export const useDraft = (draftKey: string, defaults?: Partial<DraftData>) => {
  const defaultsWithFallback = useMemo(() => {
    const ret = { ...DefaultDraftData };

    // we only copy the provided keys from defaults
    for (const k of Object.keys(DefaultDraftData) as (keyof DraftData)[]) {
      if (defaults?.[k]) {
        ret[k] = defaults[k] as never;
      }
    }
    return ret;
  }, [defaults]);

  // const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(defaultsWithFallback);

  const update = (data: Partial<DraftData>) => {
    setDraft((d) => ({ ...d, ...data }));
  };

  const remove = () => {
    setDraft(defaultsWithFallback);
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

        if (import.meta.env.DEV) {
          console.debug('[useDraft] loaded draft from IDB:', data);
        }

        if (hasData(data)) {
          setDraft({ ...defaultsWithFallback, ...data });
        } else {
          setDraft(defaultsWithFallback);
        }
      })
      .catch((e: unknown) => {
        console.error(e);
        toast.error('Failed to load draft from IndexedDB. This should not happen. Please report this bug.');
      })
      .finally(() => {
        document.dispatchEvent(new Event(`papi:draftLoaded/${draftKey}`));
      });
  }, [draftKey, defaultsWithFallback]);

  useDebounce(
    () => {
      const idbStore = getCurrentUserSiteIDB();
      if (deepEqual(draft, defaultsWithFallback)) {
        void IDB.del(draftKey, getCurrentUserSiteIDB());
        if (import.meta.env.DEV) {
          console.debug('[useDraft] removed draft because it is equal to defaults');
        }
      } else {
        void IDB.set(draftKey, draft, idbStore);
        if (import.meta.env.DEV) {
          console.debug('[useDraft] saved draft');
        }
      }
    },
    300,
    [draftKey, draft, defaultsWithFallback],
  );

  return { ...draft, update, remove, resetExcept };
};
