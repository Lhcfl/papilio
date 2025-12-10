/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkListTimeline } from '@/components/infinite-loaders/mk-list-timeline';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/lists/$id/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id: listId } = Route.useParams();
  return <MkListTimeline listId={listId} />;
}
