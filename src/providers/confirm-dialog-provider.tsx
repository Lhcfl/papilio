/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useConfirmDialog } from '@/stores/confirm-dialog';
import { CheckIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const ConfirmDialogProvider = () => {
  const { t } = useTranslation();
  const dialog = useConfirmDialog((s) => s.dialogsQueue.at(0));
  const [confirming, setConfirming] = useState(false);
  const popDialog = useConfirmDialog((s) => s.popDialog);
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
          <AlertDialogTitle>{dialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{dialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              dialog.onCancel?.();
              closeDialog();
            }}
          >
            {dialog.cancelIcon ?? <XIcon />}
            {dialog.cancelText ?? t('no')}
          </AlertDialogCancel>
          <Button
            variant={dialog.variant}
            onClick={() => {
              setConfirming(true);
              void Promise.resolve(dialog.onConfirm())
                .then(() => {
                  closeDialog();
                })
                .finally(() => {
                  setConfirming(false);
                });
            }}
          >
            {confirming ? <Spinner /> : (dialog.confirmIcon ?? <CheckIcon />)}
            {dialog.confirmText ?? t('yes')}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
