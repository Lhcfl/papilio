/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkPostForm } from '@/components/mk-post-form';
import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/posting')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DefaultLayout>
      <MkPostForm />
    </DefaultLayout>
  );
}
