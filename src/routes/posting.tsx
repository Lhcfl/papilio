import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posting')({
  component: RouteComponent,
});

function RouteComponent() {
  return <DefaultLayout>posting</DefaultLayout>;
}
