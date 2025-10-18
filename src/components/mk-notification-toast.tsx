/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Notification } from 'misskey-js/entities.js';
import { SimpleNotification } from './mk-notification';

export const MkNotificationToast = (props: { notification: Notification }) => {
  const { notification } = props;
  return (
    <SimpleNotification
      notification={notification}
      className="w-70 bg-background z-20 shadow-sm"
      size="sm"
      variant="outline"
    />
  );
};
