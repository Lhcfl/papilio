/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { PORTALABLE_HEADER_LEFT_CLASSNAME, PORTALABLE_HEADER_RIGHT_CLASSNAME } from '@/components/app-portals';
import { MkDrive } from '@/components/mk-drive';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckIcon, XIcon } from 'lucide-react';
import type { DriveFile } from 'misskey-js/entities.js';
import { useState } from 'react';

export function MkDriveFileSelect(
  props: {
    onFileSelect: (files: DriveFile[]) => void;
    limit?: number;
    ptrbRank?: number;
  } & ({ open: boolean; setOpen: (v: boolean) => void } | { children: React.ReactNode }),
) {
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
        className="max-w-300! w-[95%] max-h-[calc(100vh-4rem)] flex flex-col p-0 overflow-hidden"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Select a file</DialogTitle>
        <ScrollArea className="flex-[1_1] h-0 max-h-full flex flex-col">
          <div className="sticky top-0 bg-background z-30 border-b h-13 px-2 flex items-center justify-between">
            <div className={PORTALABLE_HEADER_LEFT_CLASSNAME} data-ptrb-rank={ptrbRank} />
            <div className="flex items-center gap-1">
              <div className={PORTALABLE_HEADER_RIGHT_CLASSNAME} data-ptrb-rank={ptrbRank} />
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
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
