/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { RulerIcon, SendIcon } from 'lucide-react';

const t = (x: string) => x;

export const PostFormSettings = {
  value: 'postform',
  name: t('postForm'),
  description: t('_preference.postFormSettingsDesc'),
  icon: <SendIcon />,
  categories: [
    {
      icon: <RulerIcon />,
      name: t('behavior'),
      description: 'TODO',
      items: [
        {
          kind: 'enum',
          key: 'keepCw',
          defaultValue: 'prependRE',
          values: ['disabled', 'enabled', 'prependRE'],
          valuesI18n: [t('keepCwDisabled'), t('keepCwEnabled'), t('keepCwPrependRe')],
          name: t('keepCw'),
          description: t('keepCwDescription'),
        },
      ],
    },
  ],
} as const;
