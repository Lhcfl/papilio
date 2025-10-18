import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/profile"!</div>;
}
