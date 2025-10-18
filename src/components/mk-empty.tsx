/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { InfoIcon } from 'lucide-react';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty';
import { useTranslation } from 'react-i18next';
import { useSiteMeta } from '@/stores/site';

export function MkEmpty() {
  const { t } = useTranslation();
  const emptyImageUrl = useSiteMeta((s) => s.infoImageUrl);

  return (
    <Empty>
      <EmptyHeader>
        {emptyImageUrl ? (
          <EmptyMedia variant="default">
            <img src={emptyImageUrl} alt="Empty" className="w-24 h-24 object-contain" />
          </EmptyMedia>
        ) : (
          <EmptyMedia variant="icon">
            <InfoIcon />
          </EmptyMedia>
        )}
        <EmptyTitle>{t('nothing')}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
