/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkMentionsList } from '@/components/infinite-loaders/mk-mentions-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/notifications/pm')({
  component: RouteComponent,
});

function RouteComponent() {
  return <MkMentionsList visibility="specified" />;
}
