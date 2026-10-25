/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { ClipsList } from '@/components/infinite-loaders/clips-list';
import { Button } from '@/ui/button';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTitle } from '@/ui/dialog';
import { InputGroup, InputGroupInput } from '@/ui/input-group';
import { Item } from '@/ui/item';
import { Label } from '@/ui/label';
import { ScrollArea } from '@/ui/scroll-area';
import { Spinner } from '@/ui/spinner';
import { Switch } from '@/ui/switch';
import { useClipNoteAction } from '@/hooks/note-actions';
import { useCreateNewClipAction } from '@/hooks/clip';
import { PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function AddClipModal(props: { open: boolean; onOpenChange: (open: boolean) => void; noteId: string }) {
  const { t } = useTranslation();

  const { mutate: addClip } = useClipNoteAction(props.noteId);
  const { mutateAsync: createClip, isPending: isCreatingClip } = useCreateNewClipAction();
  const [clipName, setClipName] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogTitle>{t('clip')}</DialogTitle>
        <ScrollArea className="max-h-70vh flex flex-col">
          <div className="p-1">
            <ClipsList>
              {(clip, children) => (
                <Item variant="outline" size="sm" className="mb-2 text-left" render={<button
                    onClick={() => {
                      addClip(clip.id);
                      props.onOpenChange(false);
                    }}/>}>
                    {children}
                  
                </Item>
              )}
            </ClipsList>
            <InputGroup>
              <InputGroupInput
                placeholder={t('createNewClip')}
                value={clipName}
                onChange={(e) => {
                  setClipName(e.target.value);
                }}
              />
            </InputGroup>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Label>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            {t('public')}
          </Label>
          <Button
            variant="ghost"
            onClick={() => {
              void createClip({
                name: clipName,
                description: '',
                isPublic: false,
              }).then(() => {
                setClipName('');
              });
            }}
            disabled={isCreatingClip}
          >
            {isCreatingClip ? <Spinner /> : <PlusIcon />}
            {t('createNewClip')}
          </Button>
          <DialogClose render={<Button variant="ghost"/>}>
              <XIcon />
              {t('cancel')}
            
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
