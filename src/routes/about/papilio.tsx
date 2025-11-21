import { PageTitle } from '@/layouts/sidebar-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/about/papilio')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PageTitle title="Papilio" />
      <h2 className="text-2xl font-semibold">Papilio</h2>
      <p>
        {__APP_VERSION__} ({__APP_COMMIT_HASH__})
      </p>
      <p>Papilio 是以 AGPL-3.0 发布的自由软件。</p>
    </div>
  );
}
