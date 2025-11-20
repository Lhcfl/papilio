/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { AvatarAndBannerEdit } from '@/components/settings/profile/avatar-and-banner-edit';
import { ProfileBaseInfoEdit } from '@/components/settings/profile/profile-base-info-edit';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/settings/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-1">
      <AvatarAndBannerEdit />
      <ProfileBaseInfoEdit />
    </div>
  );
}
