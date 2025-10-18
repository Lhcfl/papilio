import { MkNotifications, MkNotificationsFilter } from '@/components/mk-notifications';
import { createFileRoute } from '@tanstack/react-router';
import { HeaderRightPortal } from '@/layouts/default-layout';
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
      <MkNotifications excludeTypes={excluded} />;
    </>
  );
}
