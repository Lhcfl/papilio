/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { DriveFile } from 'misskey-js/entities.js';
import { useEffect, useState } from 'react';
import { create } from 'zustand';

interface Uploading {
  id: string;
  name: string;
  progressMax: number | undefined;
  progressValue: number | undefined;
  img: string;
  promise: Promise<DriveFile>;
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
    document.dispatchEvent(new CustomEvent('papi:uploadProgress', { detail: { id, value, max } }));
    set((state) => ({
      progresses: state.progresses.map((p) => (p.id === id ? { ...p, progressValue: value, progressMax: max } : p)),
    }));
  },
  remove: (id) => {
    document.dispatchEvent(new CustomEvent('papi:uploadOk', { detail: { id } }));
    set((state) => ({
      progresses: state.progresses.filter((p) => p.id !== id),
    }));
  },
  add: (uploading) => {
    document.dispatchEvent(new CustomEvent('papi:startUpload', { detail: uploading }));
    set((state) => ({
      progresses: [...state.progresses, uploading],
    }));
  },
}));

export const useOnStartUpload = (fn: (uploading: Uploading) => void) => {
  useEffect(() => {
    const handler = (ev: CustomEvent<Uploading>) => {
      fn(ev.detail);
    };
    document.addEventListener('papi:startUpload', handler as EventListener);
    return () => {
      document.removeEventListener('papi:startUpload', handler as EventListener);
    };
  }, [fn]);
};

export const useUploadProgressOfId = (id: string) => {
  const [progressValue, setProgressValue] = useState(0);
  const [progressMax, setProgressMax] = useState(1);

  useEffect(() => {
    const handler = (ev: CustomEvent<{ id: string; value: number; max: number }>) => {
      if (ev.detail.id !== id) return;
      setProgressValue(ev.detail.value);
      setProgressMax(ev.detail.max);
    };
    document.addEventListener('papi:uploadProgress', handler as EventListener);
    return () => {
      document.removeEventListener('papi:uploadProgress', handler as EventListener);
    };
  }, [id]);

  return [progressValue, progressMax];
};

export const useOnUploadOk = (fn: (id: string) => void) => {
  useEffect(() => {
    const handler = (ev: CustomEvent<{ id: string }>) => {
      fn(ev.detail.id);
    };
    document.addEventListener('papi:uploadOk', handler as EventListener);
    return () => {
      document.removeEventListener('papi:uploadOk', handler as EventListener);
    };
  }, [fn]);
};
