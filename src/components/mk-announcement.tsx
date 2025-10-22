/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { Announcement } from 'misskey-js/entities.js';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { MkMfm } from '@/components/mk-mfm';
import {
  CheckCircle,
  CheckIcon,
  ClockIcon,
  InfoIcon,
  MailOpenIcon,
  MessageCircleWarningIcon,
  XCircleIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useState } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { MkTime } from '@/components/mk-time';

export const MkAnnouncement = (props: { item: Announcement }) => {
  const { item } = props;
  const { t } = useTranslation();
  const [isRead, setIsRead] = useState(item.isRead);

  const { mutate: read, isPending } = useMutation({
    mutationKey: ['read-announcement', item.id],
    mutationFn: () => misskeyApi('i/read-announcement', { announcementId: item.id }),
    onSuccess: () => {
      setIsRead(true);
    },
  });

  return (
    <Item variant="outline" className="items-baseline">
      <div className="-mt-2 translate-y-2">
        <ItemMedia variant="icon">
          {item.icon == 'info' && <InfoIcon />}
          {item.icon == 'error' && <XCircleIcon />}
          {item.icon == 'success' && <CheckCircle />}
          {item.icon == 'warning' && <MessageCircleWarningIcon />}
        </ItemMedia>
      </div>
      <ItemContent>
        <ItemTitle className="text-base">{item.title}</ItemTitle>
        <ItemDescription>
          <MkTime time={item.createdAt} mode="detail" prepend={<ClockIcon className="size-4" />} />
        </ItemDescription>
        <div>
          <MkMfm text={item.text} />
        </div>
      </ItemContent>
      {!(item.isRead ?? isRead) && (
        <ItemActions>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={item.needConfirmationToRead ? 'default' : 'outline'}
                onClick={() => {
                  read();
                }}
              >
                {isPending ? <Spinner /> : item.needConfirmationToRead ? <CheckIcon /> : <MailOpenIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('gotIt')}</TooltipContent>
          </Tooltip>
        </ItemActions>
      )}
    </Item>
  );
};
