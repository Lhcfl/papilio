/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { DetailedSettings } from '@/settings';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export const Route = createFileRoute('/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { t } = useTranslation();
  return (
    <div>
      {DetailedSettings.map((page) => (
        <div key={page.value} className="relative flex items-center gap-3 border-b p-3">
          <Link to="/settings/$page" params={{ page: page.value }} className="absolute inset-0 h-full w-full" />
          {page.icon}
          <div>
            <h2>{t(page.name)}</h2>
            <span className="text-muted-foreground text-sm">{t(page.description)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
