import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/site/tools')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/site/tools"!</div>;
}
