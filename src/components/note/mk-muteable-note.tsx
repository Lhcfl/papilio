import { Button } from '@/components/ui/button';
import { site } from '@/lib/inject-misskey-api';
import { useMe } from '@/stores/me';
import type { NoteWithExtension } from '@/types/note';
import { acct } from 'misskey-js';
import { useState, type HTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

function useCheckSoftMute(note: NoteWithExtension) {
  const { t } = useTranslation();
  const mutedWordGroups = useMe((me) => me.mutedWords) ?? [];
  const mutedInstances = useMe((me) => me.mutedInstances) ?? [];
  const myInstance = new URL(site!).hostname;
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
}

function useCheckHardMute(note: NoteWithExtension) {
  const mutedWordGroups = useMe((me) => me.hardMutedWords) ?? [];
  return mutedWordGroups.some((words) =>
    words.every((word) => Boolean(note.text?.includes(word)) || note.cw?.includes(word)),
  );
}

export function MkMuteableNote({
  note,
  children,
  bypassMuteCheck = false,
  ...props
}: { note: NoteWithExtension; children: React.ReactNode; bypassMuteCheck?: boolean } & HTMLAttributes<HTMLDivElement>) {
  const hardMuted = useCheckHardMute(note);
  const muteReason = useCheckSoftMute(note);
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
