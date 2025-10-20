/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from '@tanstack/react-router';
import { CloudIcon } from 'lucide-react';
import type { DriveFolder } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export function MkDriveBreadcrumb(props: {
  folder: DriveFolder | null | undefined;
  onSelect?: (folder: DriveFolder | null) => void;
}) {
  const { folder, onSelect } = props;
  const { t } = useTranslation();

  if (folder == null) {
    return (
      <>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="inline-flex items-center gap-1">
            {onSelect != null ? (
              <button
                onClick={() => {
                  onSelect(null);
                }}
              >
                <CloudIcon className="size-4" />
                {t('drive')}
              </button>
            ) : (
              <Link to="/my/drive">
                <CloudIcon className="size-4" />
                {t('drive')}
              </Link>
            )}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> / </BreadcrumbSeparator>
      </>
    );
  } else {
    return (
      <>
        <MkDriveBreadcrumb folder={folder.parent} />
        <BreadcrumbItem>
          {' '}
          <BreadcrumbLink asChild>
            {onSelect != null ? (
              <button
                onClick={() => {
                  onSelect(null);
                }}
              >
                {folder.name}
              </button>
            ) : (
              <Link to="/my/drive">{folder.name}</Link>
            )}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator> / </BreadcrumbSeparator>
      </>
    );
  }
}
