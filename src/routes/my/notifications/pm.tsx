import { MkMentionsList } from '@/components/mk-mentions-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/notifications/pm')({
  component: RouteComponent,
});

function RouteComponent() {
  return <MkMentionsList visibility="specified" />;
}
