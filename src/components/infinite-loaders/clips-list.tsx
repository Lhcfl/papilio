import { MkInfiniteScroll } from '@/components/infinite-loaders/mk-infinite-scroll';
import { MkTime } from '@/components/mk-time';
import { ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { misskeyApi } from '@/services/inject-misskey-api';
import { useMe } from '@/stores/me';
import { PaperclipIcon } from 'lucide-react';
import type { Clip } from 'misskey-js/entities.js';
import { useTranslation } from 'react-i18next';

export function ClipsList(props: { children: (clip: Clip, children: React.ReactNode) => React.ReactNode }) {
  const { t } = useTranslation();
  const noteEachClipsLimit = useMe((me) => me.policies.noteEachClipsLimit);

  return (
    <MkInfiniteScroll
      queryKey={['clips']}
      queryFn={({ pageParam }) => misskeyApi('clips/list', { untilId: pageParam })}
      // misskey bug here, it always returns all clips
      getNextPageParam={() => undefined}
    >
      {(clip) =>
        props.children(
          clip,
          <>
            <ItemMedia variant="icon">
              <PaperclipIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{clip.name}</ItemTitle>
              <ItemDescription>{clip.description}</ItemDescription>
              <ItemDescription>
                <MkTime time={clip.lastClippedAt} /> {t('notesCount')}: {clip.notesCount} / {noteEachClipsLimit}
              </ItemDescription>
            </ItemContent>
          </>,
        )
      }
    </MkInfiniteScroll>
  );
}
