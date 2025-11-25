import { MkImage } from '@/components/mk-image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
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
      {children}
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
          <DialogClose asChild>
            <Button variant="outline">
              <XIcon />
              {t('cancel')}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              onClick={() => {
                onOk(caption);
              }}
            >
              <SaveIcon />
              {t('save')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
