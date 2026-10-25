/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from '@/ui/breadcrumb';
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
          {onSelect != null ? (
            <BreadcrumbLink
              className="inline-flex items-center gap-1"
              render={
                <button
                  onClick={() => {
                    onSelect(null);
                  }}
                />
              }
            >
              <CloudIcon className="size-4" />
              {t('drive')}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbLink className="inline-flex items-center gap-1" render={<Link to="/my/drive" />}>
              <CloudIcon className="size-4" />
              {t('drive')}
            </BreadcrumbLink>
          )}
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
          {onSelect != null ? (
            <BreadcrumbLink
              render={
                <button
                  onClick={() => {
                    onSelect(null);
                  }}
                />
              }
            >
              {folder.name}
            </BreadcrumbLink>
          ) : (
            <BreadcrumbLink render={<Link to="/my/drive" />}>{folder.name}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator> / </BreadcrumbSeparator>
      </>
    );
  }
}
