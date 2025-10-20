import { MkDriveFolder } from '@/components/file/mk-drive-folder';
import { MkDriveFiles } from '@/components/infinite-loaders/mk-drive-files';
import { Skeleton } from '@/components/ui/skeleton';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useQuery } from '@tanstack/react-query';

export function MkDrive(props: { folderId?: string | null }) {
  const { folderId } = props;

  const { data: folder, isPending: isFetchingFolder } = useQuery({
    queryKey: ['drive/folders/show', folderId],
    queryFn: () => misskeyApi('drive/folders/show', { folderId: folderId! }),
    enabled: folderId != null,
  });

  const { data: subfolders, isPending: isFetchingSubFolders } = useQuery({
    queryKey: ['drive/folderss', folderId],
    queryFn: () => misskeyApi('drive/folders', { folderId, limit: 100 }),
  });

  return (
    <div className="flex flex-col gap-2">
      {folder != null && (
        <div>
          {folder.parent?.name} / {folder.name}{' '}
        </div>
      )}
      {(isFetchingSubFolders || isFetchingFolder) && <Skeleton className="w-full h-15 border" />}
      {subfolders?.map((folder) => (
        <MkDriveFolder key={folder.id} folder={folder} />
      ))}
      <MkDriveFiles folderId={folderId} />
    </div>
  );
}
