/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { Tooltip, TooltipContent, TooltipTrigger } from '@/ui/tooltip';
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
      <div className="inline-flex items-center gap-1 text-[0.875rem] leading-snug font-medium tracking-[-0.002em]">
        {t(item.name)}
        {'experimental' in item && item.experimental && (
          <Tooltip>
            <TooltipTrigger title={t(item.experimental)} type="button">
              <FlaskConicalIcon className="size-3.5 text-blue-500" />
            </TooltipTrigger>
            <TooltipContent>{t(item.experimental)}</TooltipContent>
          </Tooltip>
        )}
      </div>
      {'description' in item && item.description && (
        <div className="text-muted-foreground mt-0.5 text-[0.8125rem] leading-relaxed">{t(item.description)}</div>
      )}
      {hidden && (
        <div className="text-muted-foreground mt-0.5 text-[0.8125rem] leading-relaxed">{t('settingIsDisabled')}</div>
      )}
    </div>
  );
}
