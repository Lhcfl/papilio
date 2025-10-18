/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { create } from 'zustand';

export interface DialogConfig {
  title?: React.ReactNode;
  description: React.ReactNode;
}

interface ConfirmDialogState {
  dialogsQueue: (DialogConfig & { uuid: string })[];
  pushDialog: (config: DialogConfig) => void;
  popDialog: () => void;
}

export const useErrorDialogs = create<ConfirmDialogState>((set) => ({
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
