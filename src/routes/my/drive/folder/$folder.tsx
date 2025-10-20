import { MkDrive } from '@/components/mk-drive';
import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/drive/folder/$folder')({
  component: RouteComponent,
});

function RouteComponent() {
  const folderId = Route.useParams().folder;

  return (
    <DefaultLayout title="">
      <MkDrive folderId={folderId} />
    </DefaultLayout>
  );
}
