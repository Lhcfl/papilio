/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createFileRoute } from '@tanstack/react-router';
import { MkTimeline } from '@/components/mk-timeline';

export const Route = createFileRoute('/_timeline/')({
  component: Index,
});

function Index() {
  return <MkTimeline type="home" />;
}
