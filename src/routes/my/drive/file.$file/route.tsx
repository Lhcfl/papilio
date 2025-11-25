/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AppPageTab, AppPageTabList } from '@/components/app-page-tab';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { InfoIcon, NotebookTextIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/drive/file/$file')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <AppPageTabList>
        <AppPageTab value="/my/drive/file/$file/" label={t('details')} icon={<InfoIcon />} />
        <AppPageTab
          value="/my/drive/file/$file/notes"
          label={t('_fileViewer.attachedNotes')}
          icon={<NotebookTextIcon />}
        />
      </AppPageTabList>
      <Outlet />
    </>
  );
}
