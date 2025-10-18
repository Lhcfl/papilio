/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppLanguageSelect } from '@/components/app-language-select';
import { DefaultLayout } from '@/layouts/default-layout';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <DefaultLayout>
      <AppLanguageSelect />
    </DefaultLayout>
  );
}
