/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FlaskConicalIcon } from 'lucide-react';
import type { HTMLProps } from 'react';
import { useTranslation } from 'react-i18next';

export function SettingHeader({
  item,
  hidden,
  ...props
}: HTMLProps<HTMLDivElement> & {
  item: { readonly name: string; readonly description?: string; readonly experimental?: string };
  hidden: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div {...props}>
      <div className="inline-flex items-center gap-1 text-base font-medium">
        {t(item.name)}
        {'experimental' in item && item.experimental && (
          <Tooltip>
            <TooltipTrigger title={t(item.experimental)} type="button">
              <FlaskConicalIcon className="size-4 text-blue-500" />
            </TooltipTrigger>
            <TooltipContent>{t(item.experimental)}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {'description' in item && item.description && (
        <div className="text-muted-foreground text-sm">{t(item.description)}</div>
      )}
      {hidden && <div className="text-muted-foreground text-sm">{t('settingIsDisabled')}</div>}
    </div>
  );
}
