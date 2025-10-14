import { useEffect, useState } from 'react';
import * as IDB from 'idb-keyval';
import { getCurrentUserSiteIDB } from '@/plugins/idb';
import { useDebounce } from 'react-use';
import type { DriveFile } from 'misskey-js/entities.js';

export type DraftKeyProps = { replyId?: string | null; quoteId?: string | null; editId?: string | null };

export const getDraftKey = (props: DraftKeyProps) => {
  const ret = ['draft'];
  if (props.replyId) ret.push(`reply/${props.replyId}`);
  if (props.quoteId) ret.push(`quote/${props.quoteId}`);
  if (props.editId) ret.push(`edit/${props.editId}`);
  return ret.join('::');
};

const DefaultDraftData = {
  visibility: 'public' as 'public' | 'home' | 'followers' | 'specified',
  visibleUserIds: [] as string[],
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

export const useDraft = (draftKey: string, defaults?: Partial<DraftData>) => {
  const defaultsWithFallback = { ...DefaultDraftData, ...defaults };
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(defaultsWithFallback);

  const update = (data: Partial<DraftData>) => {
    setDraft((d) => ({ ...d, ...data }));
  };

  const remove = () => {
    IDB.del(draftKey, getCurrentUserSiteIDB());
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

    IDB.get(draftKey, idbStore).then((data) => {
      function hasData(d: typeof data): d is DraftData {
        return !!d;
      }

      if (hasData(data)) {
        setDraft({ ...defaultsWithFallback, ...data });
      }

      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftKey, ...Object.values(defaultsWithFallback)]);

  useDebounce(
    () => {
      const idbStore = getCurrentUserSiteIDB();
      IDB.set(draftKey, draft, idbStore);
    },
    300,
    [draft],
  );

  return loading ? null : { ...draft, update, remove, resetExcept };
};
