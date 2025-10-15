import { MkInfiniteScroll } from '@/components/mk-infinite-scroll';
import { MkNote } from '@/components/mk-note';
import { registerNote } from '@/hooks/use-note';
import { DefaultLayout } from '@/layouts/default-layout';
import { misskeyApi } from '@/services/inject-misskey-api';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/tag/$tag')({
  component: RouteComponent,
});

function RouteComponent() {
  const tag = Route.useParams().tag;

  return (
    <DefaultLayout title={tag}>
      <MkInfiniteScroll
        queryKey={['tag', tag]}
        queryFn={() => misskeyApi('notes/search-by-tag', { tag }).then((ns) => registerNote(ns))}
      >
        {(n) => <MkNote noteId={n} />}
      </MkInfiniteScroll>
    </DefaultLayout>
  );
}
