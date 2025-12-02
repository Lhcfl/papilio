/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import type { UserDetailed } from '@/types/user';
import { MkUserName } from '@/components/mk-user-name';
import { Button } from '@/components/ui/button';
import {
  BanIcon,
  CheckIcon,
  CircleSlashIcon,
  HourglassIcon,
  MinusIcon,
  PlusIcon,
  UserRoundMinusIcon,
  UserRoundPlusIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  useCancelFollowRequestAction,
  useFollowAction,
  useUnblockAction,
  useUnfollowAction,
} from '@/hooks/user-action';
import { Spinner } from '@/components/ui/spinner';
import { MkI18n } from '@/components/mk-i18n';
import { useAfterConfirm } from '@/stores/confirm-dialog';
import { useErrorDialogs } from '@/stores/error-dialog';
import { errorMessageSafe } from '@/lib/error';
import type { ComponentProps } from 'react';

export function MkUserCardButton({
  user,
  hideLabel,
  ...props
}: { user: UserDetailed; hideLabel?: boolean } & ComponentProps<typeof Button>) {
  const { t } = useTranslation();

  const actions = {
    unfollow: useUnfollowAction(user),
    follow: useFollowAction(user),
    unblock: useUnblockAction(user),
    cancelFollowRequest: useCancelFollowRequestAction(user),
  };

  const loading = Object.values(actions).some((action) => action.isPending);

  const showErrorDialog = useErrorDialogs((s) => s.pushDialog);

  const getKind = () => {
    if (user.hasPendingFollowRequestFromYou) {
      return {
        action: 'cancelFollowRequest' as const,
        icon: HourglassIcon,
        label: t('followRequestPending'),
        actionName: t('unfollow'),
        actionIcon: UserRoundMinusIcon,
        confirm: t('unfollowConfirm'),
      };
    }
    if (user.isFollowing) {
      return {
        action: 'unfollow' as const,
        icon: MinusIcon,
        label: t('unfollow'),
        actionName: t('unfollow'),
        actionIcon: UserRoundMinusIcon,
        confirm: t('unfollowConfirm'),
      };
    }
    if (user.isBlocking) {
      return {
        action: 'unblock' as const,
        icon: BanIcon,
        label: t('blocked'),
        actionName: t('unblock'),
        variant: 'destructive' as const,
        actionIcon: CheckIcon,
        confirm: t('unblockConfirm'),
      };
    }
    if (user.isBlocked) {
      return {
        action: null,
        icon: CircleSlashIcon,
        label: t('follow'),
        btnProps: { disabled: true },
        actionIcon: () => null,
        confirm: null,
      };
    }
    return {
      action: 'follow' as const,
      icon: PlusIcon,
      label: t('follow'),
      actionName: t('follow'),
      actionIcon: UserRoundPlusIcon,
      confirm: t('followConfirm'),
    };
  };

  const { action, actionName, variant, icon: ButtonIcon, actionIcon: ActionIcon, label, confirm } = getKind();

  function handleAction() {
    if (action == null) return;
    actions[action].mutate(void null, {
      onError(error, variables, onMutateResult, context) {
        console.error('Failed to perform user action:', error, variables, onMutateResult, context);
        showErrorDialog({
          title: t('error'),
          description: errorMessageSafe(error),
        });
      },
    });
  }

  const onClick = useAfterConfirm(
    {
      title: actionName,
      description: <MkI18n i18nValue={confirm} values={{ name: <MkUserName user={user} /> }} />,
      confirmText: `${t('yes')} (${actionName})`,
      confirmIcon: <ActionIcon />,
      variant,
      cancelText: t('cancel'),
    },
    () => {
      handleAction();
    },
  );

  return (
    <Button
      {...props}
      variant={variant}
      onClick={onClick}
      disabled={loading || props.disabled}
      title={hideLabel ? label : undefined}
    >
      {loading ? <Spinner /> : <ButtonIcon />}
      {!hideLabel && label}
    </Button>
  );
}
