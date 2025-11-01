/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';
import { useNotePollRefreshAction, useNoteVoteAction } from '@/hooks/note-actions';
import { cn } from '@/lib/utils';
import { useMisskeyForkFeatures } from '@/stores/node-info';
import { CheckIcon, CircleCheckBigIcon, CircleIcon, XIcon } from 'lucide-react';
import type { Note } from 'misskey-js/entities.js';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function calculateTransform(votes: number, totalVotes: number): string {
  if (totalVotes === 0) {
    return 'translateX(-100%)';
  }
  return `translateX(-${100 - (votes / totalVotes) * 100}%)`;
}

function remaining(durationMs: number | null, interval: number): [x: number, rest: number | null] {
  if (durationMs == null) {
    return [0, null];
  }
  if (durationMs <= 0) {
    return [0, -1];
  }
  const x = Math.floor(durationMs / interval);
  const rest = durationMs % interval;
  return [x, rest];
}

export function MkNotePoll({
  noteId,
  poll,
  isRemote,
}: {
  noteId: string;
  poll: NonNullable<Note['poll']>;
  isRemote: boolean;
}) {
  const { t } = useTranslation();
  const [now, setNow] = useState(() => new Date());
  const { choices, multiple, expiresAt } = poll;
  const expiresAtDate = expiresAt ? new Date(expiresAt) : null;
  const expiresAfter = expiresAtDate ? expiresAtDate.getTime() - now.getTime() : null;
  const [remainingDays, remDaysRest] = remaining(expiresAfter, 24 * 60 * 60 * 1000);
  const [remainingHours, remHoursRest] = remaining(remDaysRest, 60 * 60 * 1000);
  const [remainingMinutes, remMinutesRest] = remaining(remHoursRest, 60 * 1000);
  const [remainingSeconds] = remaining(remMinutesRest, 1000);
  const { mutate, isPending } = useNoteVoteAction(noteId);
  const { mutate: refresh, isPending: isRefreshing, isSuccess: hasRefreshed } = useNotePollRefreshAction(noteId);
  const meVoted = choices.some((c) => c.isVoted);
  const totalVotes = choices.reduce((sum, c) => sum + c.votes, 0);
  const maxVotes = Math.max(...choices.map((c) => c.votes));
  const disabled =
    (meVoted && !multiple) || // voted, but not multiple choice
    (expiresAfter != null && expiresAfter <= 0); // expired
  const showResult = meVoted || (expiresAfter != null && expiresAfter <= 0);
  const canRefresh = useMisskeyForkFeatures().refreshPoll && isRemote && !hasRefreshed;

  const expiresI18n =
    expiresAfter == null
      ? t('_poll.infinite')
      : expiresAfter <= 0
        ? t('_poll.closed')
        : remainingDays > 0
          ? t('_poll.remainingDays', { d: remainingDays, h: remainingHours })
          : remainingHours > 0
            ? t('_poll.remainingHours', { h: remainingHours, m: remainingMinutes })
            : remainingMinutes > 0
              ? t('_poll.remainingMinutes', { m: remainingMinutes, s: remainingSeconds })
              : t('_poll.remainingSeconds', { s: remainingSeconds });

  const hint = [
    multiple ? t('_poll.multiple') : null,
    t('_poll.totalVotes', { n: totalVotes }),
    expiresI18n,
    meVoted ? t('_poll.voted') : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const interval =
    expiresAfter == null || expiresAfter <= 0
      ? -1
      : remainingDays > 0
        ? 60 * 60 * 1000
        : remainingHours > 0
          ? 60 * 1000
          : remainingMinutes > 0
            ? 1000
            : remainingSeconds > 10
              ? 1000
              : 200;

  useEffect(() => {
    if (interval < 0) {
      return;
    }
    const id = setInterval(() => {
      setNow(new Date());
    }, interval);
    return () => {
      clearInterval(id);
    };
  }, [interval]);

  return (
    <div className="mk-note-poll mt-2">
      <div className="choices flex flex-col gap-1">
        {choices.map((choice, index) => (
          <AlertDialog
            // sometimes choices can have the same text
            // eslint-disable-next-line react-x/no-array-index-key
            key={`${choice.text}-${index}`}
          >
            <AlertDialogTrigger asChild>
              <button
                type="button"
                disabled={disabled || choice.isVoted}
                className="choice relative flex items-center gap-2 overflow-hidden rounded-sm border p-2 text-left text-sm"
              >
                {choice.isVoted ? <CircleCheckBigIcon className="size-5" /> : <CircleIcon className="size-5" />}
                <span className="w-0 flex-[1_1]">{choice.text}</span>
                {showResult && (
                  <span className="text-muted-foreground">{t('_poll.votesCount', { n: choice.votes })}</span>
                )}
                <div
                  style={{
                    transform: calculateTransform(showResult ? choice.votes : 0, multiple ? maxVotes : totalVotes),
                  }}
                  className={cn(
                    'absolute bottom-0 left-0 h-full w-full transition-transform duration-500',
                    choice.isVoted ? 'bg-tertiary/10' : 'bg-primary/10',
                  )}
                />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('poll')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {multiple
                    ? t('voteConfirmMulti', { choice: choice.text })
                    : t('voteConfirm', { choice: choice.text })}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  <XIcon />
                  {t('cancel')}
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    mutate(index);
                  }}
                >
                  {isPending ? <Spinner /> : <CheckIcon />}
                  {t('yes')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
      <div className="text-muted-foreground mt-1 ml-1 text-sm">
        {hint}
        {canRefresh && (
          <button
            type="button"
            className="text-tertiary inline-flex items-center gap-1"
            onClick={() => {
              refresh();
            }}
            disabled={isRefreshing}
          >
            {' · '}
            {isRefreshing && <Spinner />}
            {t('reload')}
          </button>
        )}
      </div>
    </div>
  );
}
