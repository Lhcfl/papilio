/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from '@/components/ui/item';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryAtom } from '@/routes/settings/-atoms';
import { DetailedSettings } from '@/settings';
import { createFileRoute, Link, type LinkComponentProps } from '@tanstack/react-router';
import { useAtom, useAtomValue } from 'jotai';
import { ChevronRightIcon, UserCircle2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Fragment } from 'react/jsx-runtime';

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
    <ItemGroup>
      <SettingLinkItem
        icon={<UserCircle2Icon />}
        title={t('profile')}
        description={t('editProfile')}
        linkopts={{ to: '/settings/profile' }}
      />
      {DetailedSettings.map((page) => (
        <SettingLinkItem
          key={page.value}
          icon={page.icon}
          title={t(page.name)}
          description={t(page.description)}
          linkopts={{ to: '/settings/$page', params: { page: page.value } }}
        />
      ))}
    </ItemGroup>
  );
}

function SettingLinkItem({
  icon,
  title,
  description,
  linkopts,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkopts: LinkComponentProps;
}) {
  return (
    <>
      <Item asChild>
        <Link {...linkopts}>
          <ItemMedia variant="icon">{icon}</ItemMedia>
          <ItemContent>
            <ItemTitle className="text-base">{title}</ItemTitle>
            <ItemDescription className="line-clamp-none text-wrap">{description}</ItemDescription>
          </ItemContent>
        </Link>
      </Item>
      <ItemSeparator />
    </>
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
    category: { name: string; description?: string; icon?: React.ReactNode };
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
          page,
          category,
        });
      }

      for (const item of category.items) {
        const key = 'key' in item ? item.key.toLocaleLowerCase() : null;
        const name = t(item.name).toLocaleLowerCase();
        const description = 'description' in item && item.description ? t(item.description) : undefined;
        const descriptionLower = description?.toLocaleLowerCase();

        if (name.includes(query) || descriptionLower?.includes(query) || key?.includes(query)) {
          results.push({
            page,
            category,
            item: { name: item.name, description, id: 'key' in item ? item.key : (item as { name: string }).name },
          });
        }
      }
    }
  }

  return (
    <ItemGroup>
      {results.map(({ page, category, item }) => (
        <Fragment key={[page.value, category.name, item?.name].join(':')}>
          <Item asChild>
            <Link
              to="/settings/$page"
              params={{ page: page.value }}
              hash={[category.name, item?.id].join('::')}
              onClick={() => {
                setQuery('');
              }}
            >
              <ItemMedia variant="icon">{category.icon}</ItemMedia>
              <ItemContent>
                <ItemTitle className="text-base">
                  <span>{t(page.name)}</span>
                  <ChevronRightIcon className="mx-1 inline size-3" />
                  <span>{t(category.name)}</span>
                  {item && (
                    <>
                      <ChevronRightIcon className="mx-1 inline size-3" />
                      <span>{t(item.name)}</span>
                    </>
                  )}
                </ItemTitle>
                <ItemDescription>
                  {!item && category.description && <span>{t(category.description)}</span>}
                  {item?.description && <span>{t(item.description)}</span>}
                </ItemDescription>
              </ItemContent>
            </Link>
          </Item>
          <ItemSeparator />
        </Fragment>
      ))}
    </ItemGroup>
  );
}
