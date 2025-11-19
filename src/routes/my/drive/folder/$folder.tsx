/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkDrive } from '@/components/mk-drive';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my/drive/folder/$folder')({
  component: RouteComponent,
});

function RouteComponent() {
  const folderId = Route.useParams().folder;

  return <MkDrive folderId={folderId} />;
}
