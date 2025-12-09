import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/lists/$id/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>TODO</div>;
}
