/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Button } from '@/components/ui/button';
import { site } from '@/lib/inject-misskey-api';
import { firstTruthy } from '@/lib/match';
import { useMe } from '@/stores/me';
import type { NoteWithExtension } from '@/types/note';
import { acct } from 'misskey-js';
import { useState, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

function useCheckSoftMute(note: NoteWithExtension | null) {
  const { t } = useTranslation();
  const mutedWordGroups = useMe((me) => me.mutedWords) ?? [];
  const mutedInstances = useMe((me) => me.mutedInstances) ?? [];
  const myInstance = new URL(site!).hostname;

  if (note == null) {
    return null;
  }

  const domain = note.userHost ?? myInstance;
  const name = `@${acct.toString(note.user)}`;

  if (note.user.mandatoryCW) {
    return note.user.mandatoryCW;
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

function useCheckHardMute(note: NoteWithExtension | null) {
  const mutedWordGroups = useMe((me) => me.hardMutedWords) ?? [];

  if (note == null) {
    return false;
  }

  return mutedWordGroups.some((words) =>
    words.every((word) => Boolean(note.text?.includes(word)) || note.cw?.includes(word)),
  );
}

export function MkMuteableNote({
  note,
  appearNote,
  children,
  bypassMuteCheck = false,
  ...props
}: {
  note: NoteWithExtension | null;
  appearNote: NoteWithExtension;
  children: React.ReactNode;
  bypassMuteCheck?: boolean;
} & HTMLAttributes<HTMLDivElement>) {
  const hardMuted = firstTruthy(useCheckHardMute(note), useCheckHardMute(appearNote));
  const muteReason = firstTruthy(useCheckSoftMute(note), useCheckSoftMute(appearNote));
  const [manuallyShow, setManuallyShow] = useState(false);

  if (!bypassMuteCheck) {
    if (hardMuted) {
      return null;
    }

    if (muteReason && !manuallyShow) {
      return (
        <Button
          variant="secondary"
          onClick={() => {
            setManuallyShow(true);
          }}
        >
          {muteReason}
        </Button>
      );
    }
  }

  return <div {...props}>{children}</div>;
}
