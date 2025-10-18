/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { type MutationState, useMutationState } from '@tanstack/react-query';
import { LanguagesIcon } from 'lucide-react';
import type { NoteWithExtension } from '@/types/note';
import { MkMfm } from '../mk-mfm';
import { Item, ItemContent, ItemTitle } from '../ui/item';
import { Skeleton } from '../ui/skeleton';

export const MkNoteTranslation = (props: { note: NoteWithExtension }) => {
  const { t } = useTranslation();
  const { note } = props;

  const translation = useMutationState({
    filters: { mutationKey: ['translateNote', note.id] },
    select: (mu) => mu.state as MutationState<{ sourceLang: string; text: string }>,
  }).at(-1);

  if (!translation) return null;

  const { data, status, error } = translation;

  return (
    <Item variant="outline" className="mt-2">
      <ItemContent>
        <ItemTitle>
          <span className="flex items-center ">
            <LanguagesIcon className="size-4" /> {t('translatedFrom', { x: data?.sourceLang ?? '...' })}
          </span>
        </ItemTitle>
        <div className="text-muted-foreground">
          {status === 'pending' && (
            <div>
              <Skeleton className="h-4 mt-2 w-full" />
              <Skeleton className="h-4 mt-2 w-full" />
              <Skeleton className="h-4 mt-2 w-[75%]" />
            </div>
          )}
          {data && (
            <p>
              <MkMfm text={data.text} author={note.user} emojiUrls={note.emojis} />
            </p>
          )}
          {error && <p>{t('translationFailed')}</p>}
        </div>
      </ItemContent>
    </Item>
  );
};
