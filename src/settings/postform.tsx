/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { createEnum, createSwitch, createTextSetting } from '@/settings/types';
import { RulerIcon, SendIcon, TextCursorInputIcon } from 'lucide-react';

const t = (x: string) => x;

export const PostFormSettings = {
  value: 'postform',
  name: t('postForm'),
  description: t('_preference.postFormSettingsDesc'),
  icon: <SendIcon />,
  categories: [
    {
      icon: <TextCursorInputIcon />,
      name: t('_theme.defaultValue'),
      description: t('_preference.postFormDefaultsDesc'),
      items: [
        createSwitch('rememberVisibility', {
          defaultValue: false,
          name: t('rememberNoteVisibility'),
        }),
        createEnum('defaultNoteVisibility', {
          defaultValue: 'public',
          values: ['public', 'home', 'followers', 'specified'] as const,
          valuesI18n: [
            t('_visibility.public'),
            t('_visibility.home'),
            t('_visibility.followers'),
            t('_visibility.specified'),
          ],
          name: t('defaultNoteVisibility'),
          hidden: (settings: { rememberVisibility: boolean }) => settings.rememberVisibility,
        }),
        createSwitch('defaultLocalOnly', {
          defaultValue: false,
          name: t('_visibility.disableFederation'),
          hidden: (settings: { rememberVisibility: boolean }) => settings.rememberVisibility,
        }),
        createTextSetting('defaultCW', {
          defaultValue: '',
          name: t('defaultCW'),
          description: t('defaultCWDescription'),
          user: true,
        }),
      ],
    },
    {
      icon: <RulerIcon />,
      name: t('behavior'),
      description: 'TODO',
      items: [
        createEnum('keepCw', {
          defaultValue: 'prependRE',
          values: ['disabled', 'enabled', 'prependRE'] as const,
          valuesI18n: [t('keepCwDisabled'), t('keepCwEnabled'), t('keepCwPrependRe')],
          name: t('keepCw'),
          description: t('keepCwDescription'),
        }),
      ],
    },
  ],
} as const;
