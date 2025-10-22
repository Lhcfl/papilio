import { AppLanguageSelect } from '@/components/app-language-select';

const t = (x: string) => x;

export const GeneralSettings = {
  value: 'general',
  name: t('settings'),
  description: 'TODO',
  categories: [
    {
      name: t('general'),
      description: 'TODO',
      items: [
        {
          kind: 'custom',
          name: t('language'),
          component: <AppLanguageSelect />,
        },
        {
          kind: 'enum',
          defaultValue: 'light',
          values: ['light', 'dark'],
          key: 'theme',
          name: t('theme'),
          description: t('_preference.themeDesc'),
        },
      ],
    },
  ],
} as const;
