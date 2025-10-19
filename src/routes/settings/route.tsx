/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DefaultLayout>
      <Outlet />
    </DefaultLayout>
  );
}
