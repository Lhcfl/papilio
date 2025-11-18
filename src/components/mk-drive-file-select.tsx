/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkDrive } from '@/components/mk-drive';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getHeaderLeftId, getHeaderRightId, WindowContext } from '@/providers/window-provider';
import { CheckIcon, XIcon } from 'lucide-react';
import type { DriveFile } from 'misskey-js/entities.js';
import { useId, useState } from 'react';

export function MkDriveFileSelect(
  props: {
    onFileSelect: (files: DriveFile[]) => void;
    limit?: number;
    ptrbRank?: number;
  } & ({ open: boolean; setOpen: (v: boolean) => void } | { children: React.ReactNode }),
) {
  const popupId = useId();
  const { onFileSelect, limit = Number.POSITIVE_INFINITY, ptrbRank = 999 } = props;
  const [open, setOpen] = useState(false);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selected, setSelected] = useState<DriveFile[]>([]);

  function onOpenChange(isOpen: boolean) {
    if ('open' in props) {
      props.setOpen(isOpen);
    } else {
      setOpen(isOpen);
    }
    setSelected([]);
  }

  return (
    <Dialog open={'open' in props ? props.open : open} onOpenChange={onOpenChange}>
      {'children' in props && <DialogTrigger asChild>{props.children}</DialogTrigger>}
      <DialogContent
        className="flex max-h-[calc(100vh-4rem)] w-[95%] max-w-300! flex-col overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Select a file</DialogTitle>
        <ScrollArea className="flex h-0 max-h-full flex-[1_1] flex-col">
          <div className="bg-background sticky top-0 z-30 flex h-13 items-center justify-between border-b px-2">
            <div id={getHeaderLeftId(popupId)} data-ptrb-rank={ptrbRank} />
            <div className="flex items-center gap-1">
              <div id={getHeaderRightId(popupId)} data-ptrb-rank={ptrbRank} />
              <DialogClose
                asChild
                onClick={() => {
                  onFileSelect(selected);
                  console.log('selected files:', selected);
                }}
              >
                <Button variant="outline" size="icon-sm">
                  <CheckIcon />
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button variant="outline" size="icon-sm">
                  <XIcon />
                </Button>
              </DialogClose>
            </div>
          </div>
          <div className="p-2">
            <WindowContext value={{ headerId: popupId }}>
              <MkDrive
                key={currentFolder}
                folderId={currentFolder}
                onEnter={(f) => {
                  setCurrentFolder(f?.id ?? null);
                }}
                selecting={{
                  limit: limit,
                  selected: selected,
                  setSelected: setSelected,
                }}
              />
            </WindowContext>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
