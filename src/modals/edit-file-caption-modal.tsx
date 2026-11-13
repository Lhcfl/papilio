/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { MkImage } from '@/components/mk-image';
import { Button } from '@/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { Textarea } from '@/ui/textarea';
import type { DriveFile } from '@/types/drive-file';
import { SaveIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CommonEditFileCaptionModalProps {
  file: DriveFile;
  onOk: (newCaption: string) => void;
}

export function EditFileCaptionModal({
  file,
  onOk,
  children,
  ...rest
}: CommonEditFileCaptionModalProps &
  ({ children: React.ReactNode } | { open: boolean; children?: undefined; onOpenChange: (open: boolean) => void })) {
  const { t } = useTranslation();
  const [caption, setCaption] = useState(file.comment ?? '');

  return (
    <Dialog {...rest}>
      {children && <DialogTrigger render={children as React.ReactElement<Record<string, unknown>>} />}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('describeFile')}</DialogTitle>
          <DialogDescription>
            Alt text helps visually impaired users understand the content of your file.
          </DialogDescription>
        </DialogHeader>
        <MkImage image={file} disableMenu disableSensitiveOverlay disableNoAltTextHint />
        <Textarea
          value={caption}
          placeholder={t('enterFileDescription')}
          onChange={(e) => {
            setCaption(e.target.value);
          }}
        />
        <DialogFooter className="flex-row flex-wrap justify-end">
          <DialogClose render={<Button variant="outline" />}>
            <XIcon />
            {t('cancel')}
          </DialogClose>
          <DialogClose
            render={
              <Button
                onClick={() => {
                  onOk(caption);
                }}
              />
            }
          >
            <SaveIcon />
            {t('save')}
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
