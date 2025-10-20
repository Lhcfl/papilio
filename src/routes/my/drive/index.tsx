import { MkDrive } from '@/components/mk-drive';
import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/drive/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DefaultLayout title="">
      <MkDrive folderId={null} />
    </DefaultLayout>
  );
}
