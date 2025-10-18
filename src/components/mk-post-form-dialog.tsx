import { useState } from 'react';

import { Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { MkPostForm } from './mk-post-form';
import { Button } from './ui/button';
import { XIcon } from 'lucide-react';
export const MkPostFormDialog = (props: { children: React.ReactNode }) => {
  const [showPostForm, setShowPostForm] = useState(false);
  return (
    <Dialog open={showPostForm} onOpenChange={setShowPostForm}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="p-0 [&_>_[data-slot=dialog-close]]:hidden">
        <DialogTitle className="sr-only">posting</DialogTitle>
        <MkPostForm
          appendHeader={
            <DialogClose asChild>
              <Button variant="ghost" size="icon">
                <XIcon />
              </Button>
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
