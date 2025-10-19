/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkTimeline } from '@/components/infinite-loaders/mk-timeline';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_timeline/local-timeline')({
  component: RouteComponent,
});

function RouteComponent() {
  return <MkTimeline type="local" />;
}
