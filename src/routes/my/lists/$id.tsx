/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { listDataQueryOptions } from '@/hooks/list';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryClient } from '@/plugins/persister';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { CogIcon, ListIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/lists/$id')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(listDataQueryOptions(params.id)),
});

function RouteComponent() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const { data } = useSuspenseQuery(listDataQueryOptions(id));

  return (
    <div>
      <PageTitle title={data.name} />
      <AppPageTabList>
        <AppPageTab value="/my/lists/$id/" icon={<ListIcon />} label={t('timeline')} />
        <AppPageTab value="/my/lists/$id/settings" icon={<CogIcon />} label={t('settings')} />
      </AppPageTabList>
      <Outlet />
    </div>
  );
}
