/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { HeaderLeftPortal } from '@/components/header-portal';
import { MkEmpty } from '@/components/mk-empty';
import { EnumSettingItem } from '@/components/settings/enum';
import { SwitchSettingItem } from '@/components/settings/switch';
import { TextSettingItem } from '@/components/settings/text';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { PageTitle } from '@/layouts/sidebar-layout';
import { cn } from '@/lib/utils';
import { queryAtom } from '@/routes/settings/-atoms';
import { DetailedSettings, type SettingsItems } from '@/settings';
import { createFileRoute, Link, useLocation } from '@tanstack/react-router';
import { useAtomValue } from 'jotai';
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

  const defaultOpenCategory = catName ? [catName] : thisPageFiltered.categories.map((cat) => cat.name);

  return (
    <div>
      <PageTitle title={t(thisPageSettings.name)} noPortal />
      <HeaderLeftPortal>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/settings">{t('settings')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{t(thisPageSettings.name)}</BreadcrumbItem>
            <BreadcrumbSeparator />
          </BreadcrumbList>
        </Breadcrumb>
      </HeaderLeftPortal>
      {thisPageFiltered.categories.length === 0 && <MkEmpty />}
      <Accordion type="multiple" defaultValue={defaultOpenCategory}>
        {thisPageFiltered.categories.map((category) => (
          <AccordionItem
            key={category.name}
            value={category.name}
            className="mb-2 overflow-hidden rounded-lg border last:border-b-1"
          >
            <AccordionTrigger className="rounded-none px-3 hover:no-underline">
              <div className="flex w-full items-center gap-3">
                {category.icon}
                <div>
                  <h2 className="text-base">{t(category.name)}</h2>
                  {'description' in category && category.description && (
                    <span className="text-muted-foreground text-sm">{t(category.description)}</span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="border-t">
              {category.items.map((item) => {
                const highlighted = itemId == ('key' in item ? item.key : item.name);
                return (
                  <div key={item.kind == 'custom' ? item.name : item.key} className="relative my-4 px-3">
                    {highlighted && (
                      <div className="bg-tertiary absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 animate-ping rounded-full" />
                    )}
                    <a id={category.name + '::' + ('key' in item ? item.key : item.name)} />
                    <SettingItemPolymorph item={item} highlighted={highlighted} />
                  </div>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
            <div className="text-base font-medium">{t(item.name)}</div>
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
