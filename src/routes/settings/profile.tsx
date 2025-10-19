/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/settings/profile"!</div>;
}
