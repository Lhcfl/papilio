/*
 * SPDX-FileCopyrightText: Linca and papilio-project
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import clsx from 'clsx';
import { MkCustomEmoji, MkEmoji } from '@/components/mk-emoji';
import { normalizeEmojiName } from '@/lib/emojis';
import { useReactNoteAction, useUndoReactNoteAction } from '@/hooks/note-actions';
import type { NoteWithExtension } from '@/types/note';
import { useEmojis } from '@/stores/emojis';

const NoteReaction = (props: {
  reaction: string;
  count: number;
  url?: string;
  meReacted?: boolean;
  noteId: string;
}) => {
  const { reaction, count, url, meReacted, noteId } = props;
  const isCustomEmoji = reaction.startsWith(':');
  const [name, host] = normalizeEmojiName(reaction);

  const { mutate: undoReact, isPending: isUndoPending } = useUndoReactNoteAction(noteId);
  const { mutate: react, isPending: isReactPending } = useReactNoteAction(noteId);

  return (
    <button
      key={reaction}
      type="button"
      className={clsx('mk-note-reaction flex items-center rounded-md border px-2 py-1 text-sm', {
        'border-primary/30 bg-primary-foreground cursor-pointer': host == null,
        'border-primary/10': host != null,
        'border-tertiary bg-tertiary/10': meReacted,
        'animate-pulse': isReactPending || isUndoPending,
      })}
      onClick={
        host == null
          ? () => {
              if (meReacted) {
                undoReact();
              } else {
                react(reaction);
              }
            }
          : undefined
      }
    >
      {isCustomEmoji ? (
        <MkCustomEmoji name={name} host={host} url={url} fallbackToImage />
      ) : (
        <MkEmoji emoji={name} innerClassName="h-[2em]" />
      )}
      <span className="text-muted-foreground ml-1 text-xs">{count}</span>
    </button>
  );
};

export const MkNoteReactions = (props: { note: NoteWithExtension }) => {
  const { note } = props;
  let reactions = Object.entries(note.reactions);
  let myReaction = note.myReaction;
  const emojisMap = useEmojis((s) => s.emojisMap);

  if (reactions.length === 0) {
    return null;
  }

  const mergeSiteReactions = true;

  // todo: make this configurable
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (mergeSiteReactions) {
    const map = reactions.reduce<Record<string, number>>((acc, [reaction, count]) => {
      const [normalizedName] = normalizeEmojiName(reaction);
      const emoji = emojisMap.get(normalizedName);
      if (emoji) {
        const name = `:${normalizedName}:`;
        if (myReaction === reaction) {
          myReaction = name;
        }
        acc[name] ||= 0;
        acc[name] += count;
      } else {
        acc[reaction] = count;
      }
      return acc;
    }, {});
    reactions = Object.entries(map);
  }

  return (
    <div className="mk-note-reactions mt-2 flex flex-wrap gap-1 px-2">
      {reactions
        .sort(([, a], [, b]) => b - a)
        .map(([reaction, count]) => (
          <NoteReaction
            key={reaction}
            reaction={reaction}
            count={count}
            url={note.reactionEmojis[reaction]}
            meReacted={myReaction === reaction}
            noteId={note.id}
          />
        ))}
    </div>
  );
};
