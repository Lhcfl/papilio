/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { CircleXIcon } from 'lucide-react';
import { type APIError, isAPIError } from 'misskey-js/api.js';
import { Button } from './ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './ui/empty';

export function MkError(props: { error: Error | APIError; retry?: () => void }) {
  const { error, retry } = props;
  const { t } = useTranslation();

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CircleXIcon />
        </EmptyMedia>
        <EmptyTitle>{t('error')}</EmptyTitle>
        <EmptyDescription>
          {error.message}
          <br />
          {isAPIError(error as APIError) && `(${(error as APIError).id})`}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{retry && <Button onClick={retry}>{t('retry')}</Button>}</EmptyContent>
    </Empty>
  );
}
