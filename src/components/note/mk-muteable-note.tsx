/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Button } from '@/components/ui/button';
import { useCheckHardMute, useCheckSoftMute } from '@/hooks/mute';
import { firstTruthy } from '@/lib/match';
import type { NoteWithExtension } from '@/types/note';
import { useState, type HTMLAttributes } from 'react';

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
