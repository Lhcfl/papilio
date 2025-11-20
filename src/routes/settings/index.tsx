/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryAtom } from '@/routes/settings/-atoms';
import { DetailedSettings } from '@/settings';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useAtom, useAtomValue } from 'jotai';
import { ChevronRightIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle title={t('settings')} />
      <HasNoSearchComponent />
      <HasSearchComponent />
    </>
  );
}

function HasNoSearchComponent() {
  const { t } = useTranslation();
  const query = useAtomValue(queryAtom);
  if (query) {
    return null;
  }

  return (
    <div>
      {DetailedSettings.map((page) => (
        <div key={page.value} className="relative flex items-center gap-3 border-b p-3">
          <Link to="/settings/$page" params={{ page: page.value }} className="absolute inset-0 h-full w-full" />
          <div className="shrink-0 grow-0">{page.icon}</div>
          <div>
            <h2>{t(page.name)}</h2>
            <span className="text-muted-foreground text-sm">{t(page.description)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HasSearchComponent() {
  const { t } = useTranslation();
  const [query, setQuery] = useAtom(queryAtom);

  if (!query) {
    return null;
  }

  const results: {
    page: { name: string; value: string };
    category: { name: string; description?: string };
    item?: { name: string; description?: string; id: string };
  }[] = [];

  for (const page of DetailedSettings) {
    const pageName = t(page.name).toLocaleLowerCase();
    const pageKey = page.value.toLocaleLowerCase();

    for (const category of page.categories) {
      const categoryName = t(category.name).toLocaleLowerCase();
      const categoryKey = category.name.toLocaleLowerCase();
      const catDescription = 'description' in category && category.description ? t(category.description) : undefined;
      const descriptionLower = catDescription?.toLocaleLowerCase();

      if (
        pageName.includes(query) ||
        pageKey.includes(query) ||
        categoryName.includes(query) ||
        categoryKey.includes(query) ||
        descriptionLower?.includes(query)
      ) {
        results.push({
          page: { name: page.name, value: page.value },
          category: { name: category.name, description: catDescription },
        });
      }

      for (const item of category.items) {
        const key = 'key' in item ? item.key.toLocaleLowerCase() : null;
        const name = t(item.name).toLocaleLowerCase();
        const description = 'description' in item && item.description ? t(item.description) : undefined;
        const descriptionLower = description?.toLocaleLowerCase();

        if (name.includes(query) || descriptionLower?.includes(query) || key?.includes(query)) {
          results.push({
            page: { name: page.name, value: page.value },
            category: { name: category.name, description: catDescription },
            item: { name: item.name, description, id: 'key' in item ? item.key : item.name },
          });
        }
      }
    }
  }

  return (
    <div>
      {results.map(({ page, category, item }) => (
        <div
          key={[page.value, category.name, item?.name].join(':')}
          className="relative flex items-center gap-3 border-b p-3"
        >
          <Link
            to="/settings/$page"
            params={{ page: page.value }}
            hash={[category.name, item?.id].join('::')}
            onClick={() => {
              setQuery('');
            }}
            className="absolute inset-0 h-full w-full"
          />
          <div>
            <h2>
              <span>{t(page.name)}</span>
              <ChevronRightIcon className="mx-1 inline size-3" />
              <span>{t(category.name)}</span>
              {item && (
                <>
                  <ChevronRightIcon className="mx-1 inline size-3" />
                  <span>{t(item.name)}</span>
                </>
              )}
            </h2>
            {!item && category.description && (
              <span className="text-muted-foreground text-sm">{t(category.description)}</span>
            )}
            {item?.description && <span className="text-muted-foreground text-sm">{t(item.description)}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
