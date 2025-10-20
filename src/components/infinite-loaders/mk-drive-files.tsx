import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkDriveFile } from '@/components/file/mk-drive-file';
import { misskeyApi } from '@/services/inject-misskey-api';
import type { DriveFile } from 'misskey-js/entities.js';
import { Link } from '@tanstack/react-router';

export function MkDriveFiles(props: {
  folderId?: string | null;
  maxSelect?: number;
  selected?: DriveFile['id'][];
  setSelected?: (ids: DriveFile['id'][]) => void;
}) {
  const { folderId, selected = [], maxSelect = 0, setSelected } = props;

  const selectable = maxSelect > 0;
  const singleSelectable = maxSelect === 1;
  const multiSelectable = maxSelect > 1;
  void setSelected;

  return (
    <MkInfiniteScroll
      queryFn={({ pageParam }) =>
        misskeyApi('drive/files', { untilId: pageParam, folderId: props.folderId, limit: 50 })
      }
      queryKey={['drive', folderId]}
      containerClassName="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*50),1fr))] gap-2"
    >
      {(file) => (
        <div className="relative">
          <MkDriveFile className="w-full h-full" file={file} />
          {!selectable && (
            <Link
              to="/my/drive/file/$file"
              params={{ file: file.id }}
              className="absolute w-full h-full inset-0 z-10"
            />
          )}
          {multiSelectable && (
            <>
              <label htmlFor={`file-${file.id}`} className="absolute top-2 right-2 z-10" />
              <input
                type="checkbox"
                name={`file-${file.id}`}
                checked={selected.includes(file.id)}
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </>
          )}
          {singleSelectable && (
            <>
              <label htmlFor={`file-${file.id}`} className="absolute top-2 right-2 z-10" />
              <input
                type="radio"
                name={`file-${file.id}`}
                checked={selected.includes(file.id)}
                onChange={(e) => {
                  console.log(e);
                }}
              />
            </>
          )}
        </div>
      )}
    </MkInfiniteScroll>
  );
}
