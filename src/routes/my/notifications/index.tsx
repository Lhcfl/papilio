/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { OldMkNotifications } from '@/components/infinite-loaders/old-mk-notifications';
import { misskeyApi } from '@/lib/inject-misskey-api';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/my/notifications/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { mutate: markAllAsRead } = useMutation({
    mutationKey: ['notifications/mark-all-as-read'],
    mutationFn: () => misskeyApi('notifications/mark-all-as-read', {}),
  });

  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // oxlint-disable-next-line typescript/no-deprecated -- this route is still on the legacy notifications component and gets migrated with the window rework.
  return <OldMkNotifications />;
}
