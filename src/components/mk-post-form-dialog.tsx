/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useState } from 'react';

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@/ui/dialog';
import { MkPostForm } from '@/components/mk-post-form';
import { Button } from '@/ui/button';
import { XIcon } from 'lucide-react';

export const MkPostFormDialog = (props: { children: React.ReactNode }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  return (
    <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
      <DialogTrigger render={props.children as React.ReactElement<Record<string, unknown>>} />
      <DialogContent className="top-6 translate-y-0 p-0" showCloseButton={false}>
        <DialogTitle className="sr-only">posting</DialogTitle>
        <MkPostForm
          appendHeader={
            <DialogClose render={<Button variant="ghost" size="icon"/>}>
                <XIcon />
              
            </DialogClose>
          }
          onSuccess={() => {
            setShowPostForm(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
