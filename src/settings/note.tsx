import { NotebookIcon, PaletteIcon, RulerIcon } from 'lucide-react';

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
          kind: 'enum',
          key: 'notePostFormStyle',
          defaultValue: 'separate',
          values: ['separate', 'bottom'],
          name: t('_preference.notePostFormStyle'),
          description: t('_preference.notePostFormStyleDesc'),
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
      ],
    },
  ],
} as const;
