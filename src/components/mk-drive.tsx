import { ContextualHeaderLeftPortal, ContextualHeaderRightPortal } from '@/components/app-portals';
import { MkDriveBreadcrumb } from '@/components/file/mk-drive-breadcrumb';
import { MkDriveFolder } from '@/components/file/mk-drive-folder';
import { MkDriveFiles } from '@/components/infinite-loaders/mk-drive-files';
import { Breadcrumb, BreadcrumbList } from '@/components/ui/breadcrumb';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Skeleton } from '@/components/ui/skeleton';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { SearchIcon } from 'lucide-react';
import type { DriveFolder } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export function MkDrive(props: { folderId?: string | null; onEnter?: (folder: DriveFolder | null) => void }) {
  const { folderId, onEnter } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: folder } = useQuery({
    queryKey: ['drive/folders/show', folderId],
    queryFn: () => misskeyApi('drive/folders/show', { folderId: folderId! }),
    enabled: folderId != null,
  });

  const { data: subfolders, isPending: isFetchingSubFolders } = useQuery({
    queryKey: ['drive/folders', folderId],
    queryFn: () =>
      misskeyApi('drive/folders', { folderId, limit: 100 }).then((xs) =>
        xs.map((sf) => {
          // cache the parent folder data
          queryClient.setQueryData(['drive/folders/show', sf.id], {
            ...sf,
            parent: folder,
          });
          return sf;
        }),
      ),
    enabled: folderId == null || folder != null,
  });

  return (
    <div className="flex flex-col gap-2">
      <ContextualHeaderLeftPortal>
        <Breadcrumb>
          <BreadcrumbList>
            <MkDriveBreadcrumb folder={folder} onSelect={onEnter} />
          </BreadcrumbList>
        </Breadcrumb>
      </ContextualHeaderLeftPortal>
      <ContextualHeaderRightPortal>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder={t('search')} />
        </InputGroup>
      </ContextualHeaderRightPortal>
      {isFetchingSubFolders && <Skeleton className="w-full h-15 border" />}
      {subfolders?.map((folder) => (
        <MkDriveFolder key={folder.id} folder={folder} />
      ))}
      <MkDriveFiles folderId={folderId} />
    </div>
  );
}
