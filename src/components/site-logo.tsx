/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useSiteMeta } from '@/stores/site';
import { Avatar, AvatarImage } from './ui/avatar';
import { getRelativeUrl } from '@/services/inject-misskey-api';

export const SiteLogo = () => {
  const logoImageUrl = useSiteMeta((m) => m.logoImageUrl);
  const iconUrl = useSiteMeta((m) => m.iconUrl);
  const faviconUrl = getRelativeUrl('/favicon.ico');
  return (
    <Avatar className="rounded-none">
      <AvatarImage src={logoImageUrl ?? iconUrl ?? faviconUrl} />
    </Avatar>
  );
};
