/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useErrorDialogs } from '@/stores/error-dialog';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ErrorDialogProvider = () => {
  const { t } = useTranslation();
  const dialog = useErrorDialogs((s) => s.dialogsQueue.at(0));
  const popDialog = useErrorDialogs((s) => s.popDialog);
  const [open, setOpen] = useState(true);

  function closeDialog() {
    setOpen(false);
    setTimeout(() => {
      popDialog();
      setOpen(true);
    }, 300);
  }

  if (!dialog) return null;

  return (
    <AlertDialog key={dialog.uuid} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialog.title ?? t('error')}</AlertDialogTitle>
          <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={closeDialog}>
            <XIcon />
            {t('gotIt')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
