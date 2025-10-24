/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useEffect } from 'react';

import { toast } from 'sonner';
import { MkNotificationToast } from '@/components/mk-notification-toast';
import { createStreamChannel } from '@/services/inject-misskey-api';

export const useMainChannelListener = () => {
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

    return () => {
      if (import.meta.env.DEV) {
        console.log('[useMainChannelListener] 🔴 disposed');
      }
      connection.dispose();
    };
  }, []);
};
