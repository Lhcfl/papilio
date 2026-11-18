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

/**
 * 打开确认框，返回等待用户选择的处理器。
 * @param dialog 确认框内容（标题、描述、按钮文案等）
 * @param onConfirm 用户点确认时执行
 * @param onCancel 用户点取消时执行
 * @returns 处理器，其 Promise 在确认后 resolve `true`、取消后 resolve `false`，且会等回调返回的 Promise 完成
 */
export const useAfterConfirm = (
  dialog: Omit<DialogConfig, 'onConfirm' | 'onCancel'>,
  onConfirm: () => unknown,
  onCancel?: () => unknown,
) => {
  const pushDialog = useConfirmDialog((s) => s.pushDialog);

  return () =>
    new Promise((resolve) => {
      pushDialog({
        ...dialog,
        onConfirm: () => Promise.resolve(onConfirm()).then(() => resolve(true)),
        onCancel: () => void Promise.resolve(onCancel?.()).then(() => resolve(false)),
      });
    });
};
