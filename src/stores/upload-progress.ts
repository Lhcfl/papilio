/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { create } from 'zustand';

interface Uploading {
  id: string;
  name: string;
  progressMax: number | undefined;
  progressValue: number | undefined;
  img: string;
}

interface UploadProgressState {
  progresses: Uploading[];
  setProgress: (id: string, value: number, max: number) => void;
  remove: (id: string) => void;
  add: (uploading: Uploading) => void;
}

export const useUploadProgress = create<UploadProgressState>((set) => ({
  progresses: [],
  setProgress: (id, value, max) => {
    set((state) => ({
      progresses: state.progresses.map((p) => (p.id === id ? { ...p, progressValue: value, progressMax: max } : p)),
    }));
  },
  remove: (id) => {
    set((state) => ({
      progresses: state.progresses.filter((p) => p.id !== id),
    }));
  },
  add: (uploading) => {
    set((state) => ({
      progresses: [...state.progresses, uploading],
    }));
  },
}));
