/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ClipsList } from '@/components/infinite-loaders/clips-list';
import { Item } from '@/components/ui/item';
import { PageTitle } from '@/layouts/sidebar-layout';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/my/clips')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle title={t('clips')} />
      <ClipsList>
        {(clip, children) => (
          <Item asChild>
            <Link to="/clips/$id" params={{ id: clip.id }}>
              {children}
            </Link>
          </Item>
        )}
      </ClipsList>
    </>
  );
}
