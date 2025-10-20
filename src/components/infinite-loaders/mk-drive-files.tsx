import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkDriveFile } from '@/components/file/mk-drive-file';
import { misskeyApi } from '@/services/inject-misskey-api';

export function MkDriveFiles(props: { folderId?: string | null }) {
  const { folderId } = props;
  return (
    <MkInfiniteScroll
      queryFn={({ pageParam }) =>
        misskeyApi('drive/files', { untilId: pageParam, folderId: props.folderId, limit: 50 })
      }
      queryKey={['drive', folderId]}
      containerClassName="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*50),1fr))] gap-2"
    >
      {(file) => <MkDriveFile file={file} />}
    </MkInfiniteScroll>
  );
}
