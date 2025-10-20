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
import type { DriveFile, DriveFolder } from 'misskey-js/entities.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from 'react-use';

export function MkDrive(props: {
  folderId?: string | null;
  onEnter?: (folder: DriveFolder | null) => void;
  selecting?: {
    limit: number;
    selected: DriveFile[];
    setSelected: (files: DriveFile[]) => void;
  };
}) {
  const { folderId, onEnter, selecting } = props;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchValue, setSearchValue] = useState('');
  const [query, setQuery] = useState('');

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

  useDebounce(
    () => {
      setQuery(searchValue);
    },
    300,
    [searchValue],
  );

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
          <InputGroupInput
            placeholder={t('search')}
            value={searchValue}
            onChange={(ev) => {
              setSearchValue(ev.currentTarget.value);
            }}
          />
        </InputGroup>
      </ContextualHeaderRightPortal>
      {isFetchingSubFolders && <Skeleton className="w-full h-15 border" />}
      {subfolders?.map((folder) => (
        <MkDriveFolder
          key={folder.id}
          folder={folder}
          onClick={
            onEnter
              ? () => {
                  onEnter(folder);
                }
              : undefined
          }
        />
      ))}
      <MkDriveFiles query={query} folderId={folderId} selecting={selecting} />
    </div>
  );
}
