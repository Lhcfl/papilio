import { MkNotifications, MkNotificationsFilter } from '@/components/mk-notifications';
import { createFileRoute } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { excludeTypes } from './-atom';

export const Route = createFileRoute('/my/notifications/')({
  component: RouteComponent,
});

function RouteComponent() {
  const excludes = useAtomValue(excludeTypes);
  return <MkNotifications excludeTypes={excludes} />;
}

export function NotificationsHeaderRight() {
  return <MkNotificationsFilter excludedAtom={excludeTypes} />;
}
