import { MkTimeline } from '@/components/mk-timeline';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_timeline/local-timeline')({
  component: RouteComponent,
});

function RouteComponent() {
  return <MkTimeline type="local" />;
}
