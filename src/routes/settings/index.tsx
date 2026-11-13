/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from '@/ui/item';
import { PageTitle } from '@/layouts/sidebar-layout';
import { queryAtom } from '@/routes/settings/-atoms';
import { DetailedSettings } from '@/settings';
import { createFileRoute, Link, type LinkComponentProps } from '@tanstack/react-router';
import { useAtom, useAtomValue } from 'jotai';
import { ChevronRightIcon, UserCircle2Icon, Users2Icon } from 'lucide-react';
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
    <ItemGroup className="gap-1 px-2">
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
      <SettingLinkItem
        icon={<Users2Icon />}
        title={t('_preference.manageRelationsShip')}
        description={t('_preference.manageRelationsShipDesc')}
        linkopts={{ to: '/my/relations/followers' }}
      />
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
    <Item
      render={<Link {...linkopts} />}
      className="hover:bg-muted items-start gap-4 rounded-xl px-3 py-3 transition-colors"
    >
      <ItemMedia variant="icon" className="mt-0.5 [&_svg]:size-6!">
        {icon}
      </ItemMedia>
      <ItemContent className="gap-1">
        <ItemTitle className="text-[1.0625rem] leading-snug font-medium">{title}</ItemTitle>
        <ItemDescription className="line-clamp-none text-[0.8125rem] leading-relaxed text-wrap">
          {description}
        </ItemDescription>
      </ItemContent>
    </Item>
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
    <ItemGroup className="gap-1 px-2">
      {results.map(({ page, category, item }) => (
        <Item
          key={[page.value, category.name, item?.name].join(':')}
          render={
            <Link
              to="/settings/$page"
              params={{ page: page.value }}
              hash={[category.name, item?.id].join('::')}
              onClick={() => {
                setQuery('');
              }}
            />
          }
          className="hover:bg-muted items-start gap-4 rounded-xl px-3 py-3 transition-colors"
        >
          <ItemMedia variant="icon" className="mt-0.5 [&_svg]:size-6!">
            {category.icon}
          </ItemMedia>
          <ItemContent className="gap-1">
            <ItemTitle className="text-[1.0625rem] leading-snug font-medium">
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
            <ItemDescription className="text-[0.8125rem] leading-relaxed">
              {!item && category.description && <span>{t(category.description)}</span>}
              {item?.description && <span>{t(item.description)}</span>}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
