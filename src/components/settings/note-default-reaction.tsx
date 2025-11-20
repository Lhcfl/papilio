/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTranslation } from 'react-i18next';
import { MkCustomEmoji, MkEmoji } from '@/components/mk-emoji';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { EditIcon, Trash2Icon } from 'lucide-react';
import { MkEmojiPickerPopup } from '@/components/mk-emoji-picker-popup';
import { Spinner } from '@/components/ui/spinner';
import { useUserPreference } from '@/stores/perference';

export default function NoteDefaultReaction() {
  const { t } = useTranslation();
  const defaultLike = useUserPreference((p) => p.defaultLike);
  const setDefaultLike = useUserPreference((p) => p.setDefaultLike);

  function resetDefaultLike() {
    setDefaultLike('❤');
  }

  if (defaultLike == null) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <div>{defaultLike.startsWith(':') ? <MkCustomEmoji name={defaultLike} /> : <MkEmoji emoji={defaultLike} />}</div>
      <ButtonGroup>
        <MkEmojiPickerPopup
          onEmojiChoose={(emoji) => {
            if (typeof emoji === 'string') {
              setDefaultLike(emoji);
            } else {
              setDefaultLike(`:${emoji.name}:`);
            }
          }}
        >
          <Button size="sm" variant="outline" title={t('edit')}>
            <EditIcon />
          </Button>
        </MkEmojiPickerPopup>
        <Button size="sm" variant="outline" title={t('delete')} onClick={resetDefaultLike}>
          <Trash2Icon />
        </Button>
      </ButtonGroup>
    </div>
  );
}
