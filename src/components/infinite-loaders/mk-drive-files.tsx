/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkDriveFile } from '@/components/file/mk-drive-file';
import { sharkeyApi } from '@/lib/inject-misskey-api';
import { Link } from '@tanstack/react-router';
import type { DriveFile } from 'misskey-js/entities.js';
import { cn } from '@/lib/utils';

export function MkDriveFiles(props: {
  folderId?: string | null;
  query?: string;
  selecting?: {
    limit: number;
    selected: DriveFile[];
    setSelected: (files: DriveFile[]) => void;
  };
}) {
  const { folderId, query, selecting } = props;
  const selectLimit = selecting ? selecting.limit : 0;
  const selected = new Set(selecting?.selected.map((f) => f.id));
  const qtrim = query?.trim();
  const search = qtrim == '' ? undefined : qtrim;

  return (
    <MkInfiniteScroll
      queryFn={({ pageParam }) =>
        sharkeyApi('drive/files', {
          untilId: pageParam,
          folderId: props.folderId,
          limit: 50,
          // This is a Sharkey-only parameter
          searchQuery: search,
        }) as Promise<DriveFile[]>
      }
      queryKey={search ? ['drive', folderId, search] : ['drive', folderId]}
      containerClassName="grid grid-cols-[repeat(auto-fill,minmax(calc(var(--spacing)*40),1fr))] gap-2"
    >
      {(file) => (
        <div className="relative">
          <MkDriveFile className={cn('h-full w-full', { 'bg-tertiary/15': selected.has(file.id) })} file={file} />
          {selectLimit == 0 ? (
            <Link
              to="/my/drive/file/$file"
              params={{ file: file.id }}
              className="absolute inset-0 z-10 h-full w-full"
            />
          ) : (
            <>
              <label className="absolute inset-0 z-10 h-full w-full p-2">
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
