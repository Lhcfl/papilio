/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { useTimeline, type TimelineTypes } from '@/hooks/use-timeline';
import { LoadingTrigger } from './loading-trigger';
import { MkNote } from './mk-note';
import { Spinner } from './ui/spinner';
import { MkError } from './mk-error';

export const MkTimeline = (props: { type: TimelineTypes }) => {
  const { data, error, fetchNextPage, hasNextPage, isLoading } = useTimeline(props.type);

  return (
    <div className="mk-timerline w-full">
      {data?.pages.flatMap((page) => page.map((id) => <MkNote key={id} noteId={id} showReply />))}
      {error && <MkError error={error} />}
      {(isLoading || hasNextPage) && (
        <div className="w-full flex justify-center my-4">
          <LoadingTrigger onShow={fetchNextPage}>
            <Spinner />
          </LoadingTrigger>
        </div>
      )}
    </div>
  );
};
