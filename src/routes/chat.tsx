/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/chat')({
  component: RouteComponent,
});

function RouteComponent() {
  return <DefaultLayout>Chat Page</DefaultLayout>;
}
