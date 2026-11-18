/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderLeftPortal } from '@/components/header-portal';
import { MkEmpty } from '@/components/mk-empty';
import { EnumSettingItem } from '@/components/settings/enum';
import { SwitchSettingItem } from '@/components/settings/switch';
import { TextSettingItem } from '@/components/settings/text';
import { PageTitle } from '@/layouts/sidebar-layout';
import { cn } from '@/lib/utils';
import { queryAtom } from '@/routes/settings/-atoms';
import { DetailedSettings, type SettingsItems } from '@/settings';
import { createFileRoute, Link, useLocation } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
import { ArrowLeftIcon, CheckIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings/$page')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const page = Route.useParams().page;
  const thisPageSettings = DetailedSettings.find((p) => p.value === page);
  const [catName, itemId] = useLocation().hash.split('::', 2);
  const query = useAtomValue(queryAtom);

  // 从搜索跳转过来时，把高亮的设置项滚到视野中间
  useEffect(() => {
    if (!catName || !itemId) return undefined;
    const frame = requestAnimationFrame(() => {
      document
        .querySelector(`[data-setting-id="${CSS.escape(`${catName}::${itemId}`)}"]`)
        ?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [catName, itemId]);

  if (!thisPageSettings) {
    return <div>404 not found</div>;
  }

  const thisPageFiltered = {
    ...thisPageSettings,
    categories: thisPageSettings.categories
      .map((cat) => ({
        ...cat,
        items: t(cat.name).toLocaleLowerCase().includes(query)
          ? cat.items
          : cat.items.filter((item) => {
              const key = 'key' in item ? item.key.toLocaleLowerCase() : null;
              const name = t(item.name).toLocaleLowerCase();
              const description =
                'description' in item && item.description ? t(item.description).toLocaleLowerCase() : '';

              return !query || name.includes(query) || description.includes(query) || key?.includes(query);
            }),
      }))
      .filter((cat) => cat.items.length > 0),
  };

  return (
    <div className="px-2 pb-16">
      <PageTitle title={t(thisPageSettings.name)} noPortal />
      <HeaderLeftPortal>
        <Link
          to="/settings"
          className="text-muted-foreground hover:bg-muted hover:text-foreground -ml-1 flex items-center gap-1 rounded-md px-2 py-1 text-[0.8125rem] font-medium"
        >
          <ArrowLeftIcon className="size-3.5" />
          {t('settings')}
        </Link>
      </HeaderLeftPortal>
      {thisPageFiltered.categories.length === 0 && <MkEmpty />}
      {thisPageFiltered.categories.length > 0 && (
        <>
          <header className="pt-4">
            <h1 className="text-[1.625rem] leading-tight font-semibold tracking-[-0.02em]">
              {t(thisPageSettings.name)}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-[58ch] text-[0.8125rem] leading-relaxed">
              {t(thisPageSettings.description)}
            </p>
          </header>
          {thisPageFiltered.categories.map((category) => (
            <section key={category.name} className="mt-8">
              <div className="flex items-center gap-2.5 pb-2.5">
                <span className="text-muted-foreground [&_svg]:size-[1.0625rem]">{category.icon}</span>
                <h2 className="text-[0.875rem] font-semibold tracking-[-0.005em]">{t(category.name)}</h2>
                <span className="text-muted-foreground/70 ml-auto text-[0.6875rem] tabular-nums">
                  {t('_settingsPage.sectionCount', { count: category.items.length })}
                </span>
              </div>
              <div className="border-border border-t">
                {category.items.map((item) => {
                  const fuckitem = item as { key?: string; name: string };
                  const itemIdValue = fuckitem.key ?? fuckitem.name;
                  const highlighted = itemId === itemIdValue;
                  return (
                    <div
                      key={item.kind === 'custom' ? item.name : item.key}
                      data-setting-id={category.name + '::' + itemIdValue}
                      className="relative py-4"
                    >
                      {highlighted && (
                        <div className="bg-primary absolute top-1/2 -left-2 h-2 w-2 -translate-y-1/2 animate-ping rounded-full" />
                      )}
                      <span id={category.name + '::' + itemIdValue} />
                      <SettingItemPolymorph item={item} highlighted={highlighted} />
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          <div className="text-muted-foreground/70 mt-8 flex items-center gap-1.5 text-xs">
            <CheckIcon className="text-primary size-3.5" />
            {t('_settingsPage.autoSaved')}
          </div>
        </>
      )}
    </div>
  );
}

function SettingItemPolymorph({ item, highlighted }: { item: SettingsItems; highlighted?: boolean }) {
  const { t } = useTranslation();

  switch (item.kind) {
    case 'switch':
      return <SwitchSettingItem item={item} highlighted={highlighted} />;
    case 'enum':
      return <EnumSettingItem item={item} highlighted={highlighted} />;
    case 'custom': {
      const CustomComp = item.component;
      return (
        <div
          className={cn('flex w-full items-center', {
            'gap-2': item.direction === 'right',
            'flex-col gap-2': item.direction === 'bottom',
          })}
        >
          <div className="w-0 flex-[1_1]">
            <div className="text-[0.875rem] leading-snug font-medium tracking-[-0.002em]">{t(item.name)}</div>
          </div>
          <div>
            <CustomComp />
          </div>
        </div>
      );
    }
    case 'text':
      return <TextSettingItem item={item} highlighted={highlighted} />;
    default:
      return null;
  }
}
