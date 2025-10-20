import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/drive/file/$file')({
  component: RouteComponent,
});

function RouteComponent() {
  const fileId = Route.useParams().file;

  return <DefaultLayout title="">hello file {fileId}</DefaultLayout>;
}
