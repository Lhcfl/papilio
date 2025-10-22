/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { DefaultLayout } from '@/layouts/default-layout';
import { DetailedSettings } from '@/settings';
import { createFileRoute, Outlet, useChildMatches } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const page = useChildMatches({
    select: (ms) => ms.find((m) => m.routeId == '/settings/$page')?.params?.page,
  });

  const title = page ? t(DetailedSettings.find((p) => p.value === page)?.name ?? 'settings') : t('settings');

  return (
    <DefaultLayout title={title}>
      <Outlet />
    </DefaultLayout>
  );
}
