/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { toast } from 'sonner';
import { isAPIError } from 'misskey-js/api.js';

export const errorMessageSafe = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null && 'message' in error && typeof error.message === 'string') {
    if (isAPIError(error)) {
      return `${error.message} (${error.id})`;
    }
    return error.message;
  }
  return String(error);
};

/**
 * 把返回 Promise 的处理函数包成不返回 Promise 的事件处理器，rejection 以 toast 呈现。
 */
export function wrapAsync<Args extends unknown[]>(fn: (...args: Args) => unknown) {
  return (...args: Args) => {
    void (async () => {
      try {
        await fn(...args);
      } catch (error: unknown) {
        console.error(error);
        toast.error(errorMessageSafe(error));
      }
    })();
  };
}
