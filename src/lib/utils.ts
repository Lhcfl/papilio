/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { type ClassValue, clsx } from 'clsx';
import { toast } from 'sonner';
import { twMerge } from 'tailwind-merge';
import { errorMessageSafe } from '@/lib/error';
import i18n from '@/plugins/i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string) {
  return navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success(i18n.t('copiedToClipboard'));
    })
    .catch((e: unknown) => {
      toast.error(`Failed to copy: ${errorMessageSafe(e)}`);
    });
  // if (navigator.clipboard && window.isSecureContext) {
  //   return navigator.clipboard.writeText(text);
  // } else {
  //   const textArea = document.createElement('textarea');
  //   textArea.value = text;
  //   textArea.style.position = 'absolute';
  //   textArea.style.left = '-999999px';
  //   document.body.appendChild(textArea);
  //   textArea.focus();
  //   textArea.select();
  //   return new Promise<void>((res, rej) => {
  //     if (document.execCommand('copy')) {
  //       res();
  //     } else {
  //       rej();
  //     }
  //     textArea.remove();
  //   });
  // }
}

export function withStopPrevent<
  Ev extends {
    stopPropagation: () => void;
    preventDefault: () => void;
  },
  T,
>(fn: (ev: Ev) => T): (ev: Ev) => T {
  return (ev: Ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    return fn(ev);
  };
}

export function withNoSelection<F extends (...args: never[]) => unknown>(
  fn: F,
): (...args: Parameters<F>) => ReturnType<F> | undefined {
  return (...args: Parameters<F>) => {
    if (window.getSelection()?.toString()) {
      return;
    }
    return fn(...args) as ReturnType<F>;
  };
}

export function onlyWhenNonInteractableContentClicked<
  Ev extends {
    stopPropagation: () => void;
    preventDefault: () => void;
    target: object;
  },
  T,
>(fn: (ev: Ev) => T): (ev: Ev) => T | undefined {
  return (ev: Ev) => {
    const target = ev.target as Element;
    if (import.meta.env.DEV) {
      console.log(target);
    }
    const interactable = target.closest(
      'a,button,textarea,input,select,option,[role="button"],[role="link"],[contenteditable="true"],[role="menuitem"],[role="menuitemcheckbox"],[role="menuitemradio"]',
    );
    if (interactable) {
      if (import.meta.env.DEV) {
        console.log('stopped click event because', { interactable });
      }
      return;
    }
    if (window.getSelection()?.toString()) {
      if (import.meta.env.DEV) {
        console.log('stopped click event because', { selection: window.getSelection()?.toString() });
      }
      return;
    }
    ev.stopPropagation();
    ev.preventDefault();
    return fn(ev);
  };
}

export function withDefer<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  delay = 0,
): (...args: Args) => Promise<Awaited<R>> {
  return (...args: Args) =>
    new Promise((resolve) => {
      return setTimeout(() => {
        resolve(Promise.resolve(fn(...args)));
      }, delay);
    });
}
