/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

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
        {
          kind: 'switch',
          defaultValue: true,
          key: 'showNoteActionCounts',
          name: t('_preference.showNoteActionsCount'),
          description: t('_preference.showNoteActionsCountDesc'),
        },
        {
          kind: 'switch',
          defaultValue: false,
          key: 'disableNoteReactions',
          name: t('_stpvPlus.disableAllReactions.label'),
          description: t('_stpvPlus.disableAllReactions.caption'),
        },
        {
          kind: 'switch',
          defaultValue: true,
          key: 'mergeNoteReactions',
          name: t('_preference.mergeNoteReactions'),
          description: t('_preference.mergeNoteReactionsDesc'),
        },
        {
          kind: 'switch',
          defaultValue: true,
          key: 'collapseNotesRepliedTo',
          name: t('collapseNotesRepliedTo'),
        },
        {
          kind: 'switch',
          defaultValue: false,
          key: 'showTranslateInActions',
          name: t('showTranslationButtonInNoteFooter'),
        },
        {
          kind: 'switch',
          defaultValue: false,
          key: 'expandLongNote',
          name: t('expandLongNote'),
        },
        {
          kind: 'switch',
          defaultValue: false,
          key: 'loadRawImages',
          name: t('loadRawImages'),
        },
        {
          kind: 'enum',
          key: 'notePostFormStyle',
          defaultValue: 'separate',
          values: ['separate', 'bottom'],
          name: t('_preference.notePostFormStyle'),
          description: t('_preference.notePostFormStyleDesc'),
        },
        {
          kind: 'enum',
          key: 'noteOneImageMaxAspectRatio',
          defaultValue: '16:9',
          values: ['16:9', '4:3', '1:1', '3:4', '2:3'],
          valuesI18n: [
            [t('limitTo'), { x: '16:9' }],
            [t('limitTo'), { x: '4:3' }],
            [t('limitTo'), { x: '1:1' }],
            [t('limitTo'), { x: '3:4' }],
            [t('limitTo'), { x: '2:3' }],
          ],
          name: t('mediaListWithOneImageAppearance'),
        },
      ],
    },
    {
      icon: <RulerIcon />,
      name: t('behavior'),
      description: 'TODO',
      items: [
        {
          kind: 'switch',
          key: 'clickToOpenNote',
          defaultValue: true,
          name: t('clickToOpen'),
        },
        {
          kind: 'custom',
          key: 'defaultLike',
          defaultValue: '❤' as string,
          name: t('defaultLike'),
          direction: 'right' as 'right' | 'bottom',
          user: true,
          component: lazy(() => import('@/components/settings/note-default-reaction')),
        },
      ],
    },
  ],
} as const;
