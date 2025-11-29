/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AnnouncementsList } from '@/components/infinite-loaders/announcements-list';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/announcements/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <AnnouncementsList value="current" />;
}
