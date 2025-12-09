import { MkListTimeline } from '@/components/infinite-loaders/mk-list-timeline';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/lists/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id: listId } = Route.useParams();
  return <MkListTimeline listId={listId} />;
}
