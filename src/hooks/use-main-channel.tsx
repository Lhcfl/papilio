import { useEffect } from 'react';

import { toast } from 'sonner';
import { MkNotificationToast } from '@/components/mk-notification-toast';
import { injectMisskeyStream } from '@/services/inject-misskey-api';

export const useMainChannelListener = () => {
  useEffect(() => {
    const stream = injectMisskeyStream();
    const connection = stream.useChannel('main');
    if (import.meta.env.DEV) {
      console.log('[useMainChannelListener] subscribed');
    }

    connection.on('notification', (n) => {
      if (import.meta.env.DEV) {
        console.log('[useMainChannelListener] received notification', n);
      }

      toast.custom((id) => <MkNotificationToast key={`toast-${id}`} notification={n} />);
    });

    return () => {
      if (import.meta.env.DEV) {
        console.log('[useMainChannelListener] disposed');
      }
      connection.dispose();
    };
  }, []);
};
