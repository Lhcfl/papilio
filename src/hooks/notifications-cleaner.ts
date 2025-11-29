/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useMarkAllAsReadAction } from '@/hooks/notifications';
import { usePreference } from '@/stores/perference';
import { useEffect } from 'react';

function isInViewport(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0 && rect.left < window.innerWidth && rect.right > 0;
}

export function useNotificationsCleaner() {
  const clearNotificationsOnFocus = usePreference((p) => p.clearNotificationsOnFocus);

  const { mutate } = useMarkAllAsReadAction();

  useEffect(() => {
    if (!clearNotificationsOnFocus) return;

    function handleFocus() {
      setTimeout(() => {
        if (document.hasFocus()) {
          if (import.meta.env.DEV) {
            console.log('⚡️ Window focused, clearing notifications...');
          }
          const notificationElements = document.querySelectorAll<HTMLElement>('.mk-notifications');
          if (Array.from(notificationElements).some((el) => isInViewport(el))) {
            mutate();
          }
        }
      }, 4000);
    }

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [clearNotificationsOnFocus, mutate]);
}
