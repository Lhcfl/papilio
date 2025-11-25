/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Button } from '@/components/ui/button';
import {
  DialogDescription,
  DialogTitle,
  DialogClose,
  DialogFooter,
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { useMutation } from '@tanstack/react-query';
import { SendIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function FlagModal({
  open,
  onOpenChange,
  defaultReason,
  userId,
  moreMutationKey,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultReason?: string;
  userId: string;
  moreMutationKey: string[];
}) {
  const { t } = useTranslation();
  const [reason, setReason] = useState(defaultReason ?? '');

  const { mutate } = useMutation({
    mutationKey: ['flag', ...moreMutationKey],
    mutationFn: () =>
      misskeyApi('users/report-abuse', {
        userId,
        comment: reason,
      }),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{t('reportAbuse')}</DialogTitle>
        <DialogDescription>{t('fillAbuseReportDescription')}</DialogDescription>
        <Textarea
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
          }}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <XIcon />
              {t('cancel')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                mutate();
              }}
            >
              <SendIcon />
              {t('send')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
