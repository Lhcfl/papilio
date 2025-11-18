/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkNotifications, MkNotificationsFilter } from '@/components/infinite-loaders/mk-notifications';
import { createFileRoute } from '@tanstack/react-router';
import { HeaderRightPortal } from '@/components/header-portal';
import type { NotificationIncludeableType } from '@/lib/notifications';
import { useState } from 'react';

export const Route = createFileRoute('/my/notifications/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [excluded, setExcluded] = useState<NotificationIncludeableType[]>([]);
  return (
    <>
      <HeaderRightPortal>
        <MkNotificationsFilter excluded={excluded} setExcluded={setExcluded} />
      </HeaderRightPortal>
      <MkNotifications excludeTypes={excluded} />
    </>
  );
}
