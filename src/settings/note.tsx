/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { defineEnum, defineKeyCustom, defineSwitch } from '@/settings/types';
import { NotebookIcon, PaletteIcon, RulerIcon } from 'lucide-react';
import { lazy } from 'react';

const t = (x: string) => x;

export const NoteSettings = {
  value: 'notes',
  name: t('notes'),
  description: t('_preference.notesSettingsDesc'),
  icon: <NotebookIcon />,
  categories: [
    {
      icon: <PaletteIcon />,
      name: t('appearance'),
      description: 'TODO',
      items: [
        defineSwitch('showNoteActionCounts', {
          defaultValue: true,
          name: t('_preference.showNoteActionsCount'),
          description: t('_preference.showNoteActionsCountDesc'),
        }),
        defineSwitch('disableNoteReactions', {
          defaultValue: false,
          name: t('_stpvPlus.disableAllReactions.label'),
          description: t('_stpvPlus.disableAllReactions.caption'),
        }),
        defineSwitch('mergeNoteReactions', {
          defaultValue: true,
          name: t('_preference.mergeNoteReactions'),
          description: t('_preference.mergeNoteReactionsDesc'),
        }),
        defineSwitch('collapseNotesRepliedTo', {
          defaultValue: true,
          name: t('collapseNotesRepliedTo'),
        }),
        defineSwitch('showTranslateInActions', {
          defaultValue: false,
          name: t('showTranslationButtonInNoteFooter'),
        }),
        defineSwitch('expandLongNote', {
          defaultValue: false,
          name: t('expandLongNote'),
        }),
        defineSwitch('loadRawImages', {
          defaultValue: false,
          name: t('loadRawImages'),
        }),
        defineEnum('notePostFormStyle', {
          defaultValue: 'separate',
          values: ['separate', 'bottom'] as const,
          name: t('_preference.notePostFormStyle'),
          description: t('_preference.notePostFormStyleDesc'),
        }),
        defineEnum('noteOneImageMaxAspectRatio', {
          defaultValue: '16:9',
          values: ['16:9', '4:3', '1:1', '3:4', '2:3'] as const,
          valuesI18n: [
            [t('limitTo'), { x: '16:9' }],
            [t('limitTo'), { x: '4:3' }],
            [t('limitTo'), { x: '1:1' }],
            [t('limitTo'), { x: '3:4' }],
            [t('limitTo'), { x: '2:3' }],
          ],
          name: t('mediaListWithOneImageAppearance'),
        }),
        defineEnum('displayOfSensitiveMedia', {
          defaultValue: 'respect',
          values: ['respect', 'ignore', 'force'] as const,
          valuesI18n: [
            t('_displayOfSensitiveMedia.respect'),
            t('_displayOfSensitiveMedia.ignore'),
            t('_displayOfSensitiveMedia.force'),
          ],
          name: t('displayOfSensitiveMedia'),
        }),
      ],
    },
    {
      icon: <RulerIcon />,
      name: t('behavior'),
      description: 'TODO',
      items: [
        defineSwitch('clickToOpenNote', {
          defaultValue: true,
          name: t('clickToOpen'),
        }),
        defineKeyCustom(
          lazy(() => import('@/components/settings/note-default-reaction')),
          {
            key: 'defaultLike',
            defaultValue: '❤' as string,
            name: t('defaultLike'),
            direction: 'right' as 'right' | 'bottom',
            user: true,
          },
        ),
        defineEnum('renoteVisibility', {
          defaultValue: 'choose',
          name: t('visibilityOnBoost'),
          values: ['public', 'home', 'followers', 'choose'] as const,
          valuesI18n: [t('public'), t('home'), t('followers'), t('_role.manual')],
        }),
      ],
    },
  ],
} as const;
