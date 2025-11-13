/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { User } from '@/types/user';
import { useTranslation } from 'react-i18next';
import { MkAvatar } from '@/components/mk-avatar';
import { MkUserName } from '@/components/mk-user-name';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemMedia } from '@/components/ui/item';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CheckIcon, XIcon } from 'lucide-react';
import { acct } from 'misskey-js';
import {
  useAcceptFollowRequestAction,
  useCancelFollowRequestAction,
  useRejectFollowRequestAction,
} from '@/hooks/user-action';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

export const MkFollowRequest = (props: { user: User; type: 'received' | 'sent' }) => {
  const { user, type } = props;
  const { t } = useTranslation();

  const [isRemoved, setIsRemoved] = useState(false);
  const { mutate: accept, isPending: isAccepting } = useAcceptFollowRequestAction(user);
  const { mutate: reject, isPending: isRejecting } = useRejectFollowRequestAction(user);
  const { mutate: cancel, isPending: isCanceling } = useCancelFollowRequestAction(user);

  if (isRemoved) return null;

  return (
    <Item>
      <ItemMedia>
        <MkAvatar user={user} avatarProps={{ className: 'size-10' }} />
      </ItemMedia>
      <ItemContent>
        <ItemHeader>
          <MkUserName user={user} />
        </ItemHeader>
        <ItemDescription>@{acct.toString(user)}</ItemDescription>
      </ItemContent>
      <ItemActions>
        {type === 'received' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  accept(void null, {
                    onSuccess: () => {
                      setIsRemoved(true);
                    },
                  });
                }}
                disabled={isAccepting || isRejecting || isCanceling}
              >
                {isAccepting ? <Spinner /> : <CheckIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('accept')}</TooltipContent>
          </Tooltip>
        )}
        {type === 'received' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  reject(void null, {
                    onSuccess: () => {
                      setIsRemoved(true);
                    },
                  });
                }}
                disabled={isAccepting || isRejecting || isCanceling}
              >
                {isRejecting ? <Spinner /> : <XIcon className="text-destructive!" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('reject')}</TooltipContent>
          </Tooltip>
        )}
        {type === 'sent' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  cancel(void null, {
                    onSuccess: () => {
                      setIsRemoved(true);
                    },
                  });
                }}
                disabled={isAccepting || isRejecting || isCanceling}
              >
                {isCanceling ? <Spinner /> : <XIcon className="text-destructive!" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('cancel')}</TooltipContent>
          </Tooltip>
        )}
      </ItemActions>
    </Item>
  );
};
