/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Notification } from 'misskey-js/entities.js';
import { SimpleNotification } from '@/components/mk-notification';

export const MkNotificationToast = (props: { notification: Notification }) => {
  const { notification } = props;
  return (
    <SimpleNotification
      notification={notification}
      className="bg-background z-20 w-70 shadow-sm"
      size="sm"
      variant="outline"
    />
  );
};
