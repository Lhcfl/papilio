import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkDriveFile } from '@/components/file/mk-drive-file';
import { misskeyApi } from '@/services/inject-misskey-api';
import { Link } from '@tanstack/react-router';
import type { DriveFile } from 'misskey-js/entities.js';
import { cn } from '@/lib/utils';

export function MkDriveFiles(props: {
  folderId?: string | null;
  selecting?: {
    limit: number;
    selected: DriveFile[];
    setSelected: (files: DriveFile[]) => void;
  };
}) {
  const { folderId, selecting } = props;
  const selectLimit = selecting ? selecting.limit : 0;
  const selected = new Set(selecting?.selected.map((f) => f.id));

  return (
    <MkInfiniteScroll
      queryFn={({ pageParam }) =>
        misskeyApi('drive/files', { untilId: pageParam, folderId: props.folderId, limit: 50 })
      }
      queryKey={['drive', folderId]}
      containerClassName="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*40),1fr))] gap-2"
    >
      {(file) => (
        <div className="relative">
          <MkDriveFile className={cn('w-full h-full', { 'bg-tertiary/15': selected.has(file.id) })} file={file} />
          {selectLimit == 0 ? (
            <Link
              to="/my/drive/file/$file"
              params={{ file: file.id }}
              className="absolute w-full h-full inset-0 z-10"
            />
          ) : (
            <>
              <label className="absolute w-full h-full inset-0 z-10 p-2">
                <input
                  type={selectLimit == 1 ? 'radio' : 'checkbox'}
                  className="size-4"
                  name={file.id}
                  checked={selected.has(file.id)}
                  disabled={selected.size == selectLimit && !selected.has(file.id)}
                  onChange={(e) => {
                    if (e.currentTarget.checked) {
                      if (selectLimit === 1) {
                        selecting?.setSelected([file]);
                      } else {
                        selecting?.setSelected([...selecting.selected, file]);
                      }
                    } else {
                      selecting?.setSelected(selecting.selected.filter((f) => f.id !== file.id));
                    }
                  }}
                />
              </label>
            </>
          )}
        </div>
      )}
    </MkInfiniteScroll>
  );
}
