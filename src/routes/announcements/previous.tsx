import { AnnouncementsList } from '@/components/infinite-loaders/announdements-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/announcements/previous')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AnnouncementsList value="previous" />;
}
