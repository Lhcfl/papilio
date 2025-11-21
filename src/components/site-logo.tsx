/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useSiteMeta } from '@/stores/site';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getRelativeUrl } from '@/lib/inject-misskey-api';

export const SiteLogo = (props: React.ComponentProps<typeof Avatar>) => {
  const logoImageUrl = useSiteMeta((m) => m.iconUrl);
  const iconUrl = useSiteMeta((m) => m.iconUrl);
  const faviconUrl = getRelativeUrl('/favicon.ico');
  return (
    <Avatar className="rounded-none" {...props}>
      <AvatarImage src={logoImageUrl ?? iconUrl ?? faviconUrl} />
    </Avatar>
  );
};
