import { EnumSettingItem } from '@/components/settings/enum';
import { SwitchSettingItem } from '@/components/settings/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
          <AccordionItem key={category.name} value={category.name} className="border px-2">
            <AccordionTrigger>
              <div>
                <h2>{t(category.name)}</h2>
                <span>{t(category.description)}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
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
        <div>
          <h3>{t(item.name)}</h3>
          {item.component}
        </div>
      );
    default:
      return null;
  }
}
