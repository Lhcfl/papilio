/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { site } from '@/lib/inject-misskey-api';
import { useMe } from '@/stores/me';
import type { NoteWithExtension } from '@/types/note';
import { acct } from 'misskey-js';
import { useTranslation } from 'react-i18next';

export function useCheckSoftMute(note: NoteWithExtension | null) {
  const { t } = useTranslation();
  const mutedWordGroups = useMe((me) => me.mutedWords) ?? [];
  const mutedInstances = useMe((me) => me.mutedInstances) ?? [];
  const myInstance = new URL(site!).hostname;

  if (note == null) {
    return null;
  }

  const domain = note.userHost ?? myInstance;
  const name = `@${acct.toString(note.user)}`;

  if (note.mandatoryCW) {
    return t('noteIsFlaggedAs', { name, cw: note.mandatoryCW });
  }

  if (note.user.mandatoryCW) {
    return t('userIsFlaggedAs', { name, cw: note.user.mandatoryCW });
  }

  if (note.isMutingNote) {
    return t('userSaysSomething', { name });
  }

  const wordMutedBy = mutedWordGroups.find((words) =>
    words.every((word) => Boolean(note.text?.includes(word)) || note.cw?.includes(word)),
  );

  if (wordMutedBy) {
    return t('userSaysSomethingAbout', { name, word: wordMutedBy.join(', ') });
  }

  const instanceMuted = mutedInstances.includes(domain);

  if (instanceMuted) {
    return t('stpvDomainUserSaysSomething', { domain, name });
  }

  return null;
}

export function useCheckHardMute(note: NoteWithExtension | null) {
  const mutedWordGroups = useMe((me) => me.hardMutedWords) ?? [];

  if (note == null) {
    return false;
  }

  return mutedWordGroups.some((words) =>
    words.every((word) => Boolean(note.text?.includes(word)) || note.cw?.includes(word)),
  );
}
