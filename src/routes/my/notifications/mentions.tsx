import { MkMentionsList } from '@/components/mk-mentions-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/notifications/mentions')({
  component: RouteComponent,
});

function RouteComponent() {
  return <MkMentionsList />;
}
