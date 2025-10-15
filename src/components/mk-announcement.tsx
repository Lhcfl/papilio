import type { Announcement } from 'misskey-js/entities.js';
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from './ui/item';
import { MkMfm } from './mk-mfm';
import { CheckCircle, CheckIcon, InfoIcon, MailOpenIcon, MessageCircleWarningIcon, XCircleIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useState } from 'react';
import { Spinner } from './ui/spinner';

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
      <div className="translate-y-2 -mt-2">
        <ItemMedia variant="icon">
          {item.icon == 'info' && <InfoIcon />}
          {item.icon == 'error' && <XCircleIcon />}
          {item.icon == 'success' && <CheckCircle />}
          {item.icon == 'warning' && <MessageCircleWarningIcon />}
        </ItemMedia>
      </div>
      <ItemContent>
        <ItemTitle className="text-base">{item.title}</ItemTitle>
        <div>
          <MkMfm text={item.text} />
        </div>
      </ItemContent>
      {!(item.isRead || isRead) && (
        <ItemActions>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={item.needConfirmationToRead ? 'default' : 'outline'}
                onClick={() => read()}
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
