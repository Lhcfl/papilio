/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNotificationActions } from '@/components/notifications/mk-notification-actions';
import { MkNotifications } from '@/components/notifications/mk-notifications';
import { defineWindow } from '@/components/window/define-window';
import type { NotificationIncludeableType } from '@/lib/notifications';
import { BellIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const NotificationsWindow = defineWindow(
  {
    id: 'notifications',
    version: 1,
  },
  () => {
    const { t } = useTranslation();
    const [exclude, setExclude] = useState<NotificationIncludeableType[]>([]);

    return {
      icon: <BellIcon className="size-4" />,
      title: t('notifications'),
      caption: t('notifications'),
      actions: <MkNotificationActions exclude={exclude} onExcludeChange={setExclude} />,
      body: <MkNotifications exclude={exclude} />,
    };
  },
);
