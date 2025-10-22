import { EnumSettingItem } from '@/components/settings/enum';
import { SwitchSettingItem } from '@/components/settings/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { DetailedSettings, type SettingsItems } from '@/settings';
import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings/$page')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  const page = Route.useParams().page;
  const thisPageSettings = DetailedSettings.find((p) => p.value === page);

  if (!thisPageSettings) {
    return <div>404 not found</div>;
  }

  return (
    <div>
      <Accordion type="multiple">
        {thisPageSettings.categories.map((category) => (
          <AccordionItem
            key={category.name}
            value={category.name}
            className="mb-2 overflow-hidden rounded-lg border last:border-b-1"
          >
            <AccordionTrigger className="bg-accent rounded-none px-3 hover:no-underline">
              <div className="flex w-full items-center gap-3">
                {category.icon}
                <div>
                  <h2 className="text-base">{t(category.name)}</h2>
                  <span className="text-muted-foreground text-sm">{t(category.description)}</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-3">
              {category.items.map((item) => (
                <div key={item.kind == 'custom' ? item.name : item.key} className="my-4">
                  <SettingItemPolymorph item={item} />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

function SettingItemPolymorph({ item }: { item: SettingsItems }) {
  const { t } = useTranslation();

  switch (item.kind) {
    case 'switch':
      return <SwitchSettingItem item={item} />;
    case 'enum':
      return <EnumSettingItem item={item} />;
    case 'custom':
      return (
        <div
          className={cn('flex w-full items-center', {
            'gap-2': item.direction === 'right',
            'flex-col gap-2': item.direction === 'bottom',
          })}
        >
          <div className="w-0 flex-[1_1]">
            <div className="text-base">{t(item.name)}</div>
          </div>
          <div>{item.component}</div>
        </div>
      );
    default:
      return null;
  }
}
