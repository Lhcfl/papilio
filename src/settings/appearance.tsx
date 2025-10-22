const t = (x: string) => x;

export const AppearanceSettings = {
  value: 'appearance',
  name: t('appearance'),
  description: t('_settings.appearanceBanner'),
  categories: [
    {
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
