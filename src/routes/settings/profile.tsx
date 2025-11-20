/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AvatarAndBannerEdit } from '@/components/settings/profile/avatar-and-banner-edit';
import { ProfileBaseInfoEdit } from '@/components/settings/profile/profile-base-info-edit';
import { PageTitle } from '@/layouts/sidebar-layout';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <div className="px-1">
      <PageTitle title={t('editProfile')} />
      <AvatarAndBannerEdit />
      <ProfileBaseInfoEdit />
    </div>
  );
}
