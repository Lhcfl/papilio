/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { create } from 'zustand';

export interface DialogConfig {
  title: React.ReactNode;
  description: React.ReactNode;
  confirmText?: React.ReactNode;
  confirmIcon?: React.ReactNode;
  cancelText?: React.ReactNode;
  cancelIcon?: React.ReactNode;
  variant?: 'default' | 'destructive';
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
}

interface ConfirmDialogState {
  dialogsQueue: (DialogConfig & { uuid: string })[];
  pushDialog: (config: DialogConfig) => void;
  popDialog: () => void;
}

export const useConfirmDialog = create<ConfirmDialogState>((set) => ({
  dialogsQueue: [],
  pushDialog: (config: DialogConfig) => {
    set((state) => ({
      dialogsQueue: [...state.dialogsQueue, { ...config, uuid: crypto.randomUUID() }],
    }));
  },
  popDialog: () => {
    set((state) => ({
      dialogsQueue: state.dialogsQueue.slice(1),
    }));
  },
}));

export const useAfterConfirm = (
  dialog: Omit<DialogConfig, 'onConfirm' | 'onCancel'>,
  onConfirm: () => void | Promise<void>,
  onCancel?: () => unknown,
) => {
  const pushDialog = useConfirmDialog((s) => s.pushDialog);

  return () =>
    new Promise((resolve) => {
      pushDialog({
        ...dialog,
        onConfirm: () =>
          Promise.resolve(onConfirm()).then(() => {
            resolve(true);
          }),
        onCancel: () =>
          Promise.resolve(onCancel?.()).then(() => {
            resolve(false);
          }),
      });
    });
};
