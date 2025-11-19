import { createFileRoute, useLoaderData } from '@tanstack/react-router';

export const Route = createFileRoute('/clips/$id/edit')({
  component: RouteComponent,
});

function RouteComponent() {
  const clip = useLoaderData({ from: '/clips/$id' });

  return (
    <div>
      Edit Clip: {clip.name}
      Not yet implemented.
    </div>
  );
}
