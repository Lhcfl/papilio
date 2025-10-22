import { NotebookIcon, PaletteIcon } from 'lucide-react';

const t = (x: string) => x;

export const AppearanceSettings = {
  value: 'appearance',
  name: t('appearance'),
  description: t('_settings.appearanceBanner'),
  icon: <PaletteIcon />,
  categories: [
    {
      icon: <PaletteIcon />,
      name: t('theme'),
      description: 'TODO',
      items: [
        {
          kind: 'enum',
          key: 'theme',
          defaultValue: 'light',
          values: ['light', 'dark'],
          valuesI18n: ['light', 'dark'],
          name: t('theme'),
          description: t('myTheme'),
        },
      ],
    },
    {
      icon: <NotebookIcon />,
      name: t('notes'),
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
          kind: 'enum',
          key: 'notePostFormStyle',
          defaultValue: 'separate',
          values: ['separate', 'bottom'],
          name: t('_preference.notePostFormStyle'),
          description: t('_preference.notePostFormStyleDesc'),
        },
      ],
    },
  ],
} as const;
