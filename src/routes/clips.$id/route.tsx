/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTabs } from '@/components/app-page-tab';
import { clipQueryOptions } from '@/hooks/use-clip';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryClient } from '@/plugins/persister';
import { useMe } from '@/stores/me';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { EditIcon, PaperclipIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/clips/$id')({
  component: RouteComponent,
  loader: ({ params }) => queryClient.ensureQueryData(clipQueryOptions(params.id)),
});

function RouteComponent() {
  const { t } = useTranslation();
  const { id } = Route.useParams();
  const { data: clip } = useSuspenseQuery(clipQueryOptions(id));
  const meId = useMe((me) => me.id);

  return (
    <>
      <AppPageTabs
        tabs={[
          { value: `/clips/${clip.id}`, label: t('notes'), icon: <PaperclipIcon /> },
          clip.userId == meId && { value: `/clips/${clip.id}/edit`, label: t('edit'), icon: <EditIcon /> },
        ]}
      />
      <PageTitle title={clip.name} />
      <Outlet />
    </>
  );
}
