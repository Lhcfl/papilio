/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect } from 'react';
import { toast } from 'sonner';
import { MkNotificationToast } from '@/components/mk-notification-toast';
import { createStreamChannel } from '@/services/inject-misskey-api';
import { useSetAtom } from 'jotai';
import { unreadNotificationsAtom } from '@/stores/unread-notifications';

export const useMainChannelListener = () => {
  const setUnreadNotifications = useSetAtom(unreadNotificationsAtom);

  useEffect(() => {
    const connection = createStreamChannel('main');
    if (import.meta.env.DEV) {
      console.log('[useMainChannelListener] 🟢 subscribed');
    }

    connection.on('notification', (n) => {
      if (import.meta.env.DEV) {
        console.log('[useMainChannelListener] 🆕 on notification', n);
      }

      toast.custom((id) => <MkNotificationToast key={`toast-${id}`} notification={n} />);
    });

    connection.on('unreadNotification', () => {
      setUnreadNotifications((count) => count + 1);
    });

    connection.on('readAllNotifications', () => {
      setUnreadNotifications(0);
    });

    return () => {
      if (import.meta.env.DEV) {
        console.log('[useMainChannelListener] 🔴 disposed');
      }
      connection.dispose();
    };
  }, [setUnreadNotifications]);
};
