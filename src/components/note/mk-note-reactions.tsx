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
import { usePreference } from '@/stores/perference';

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
      className={clsx('mk-note-reaction flex items-center rounded-lg border px-2.5 py-1.5 text-sm', {
        'border-primary/30 bg-primary-foreground cursor-pointer': host == null,
        'border-primary/10': host != null,
        'border-primary bg-primary/10': meReacted,
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
  const disableReactions = usePreference((x) => x.disableNoteReactions);
  const mergeNoteReactions = usePreference((x) => x.mergeNoteReactions);
  let reactions = Object.entries(note.reactions);
  const emojisMap = useEmojis((s) => s.emojisMap);

  if (reactions.length === 0) {
    return null;
  }

  let myReaction = note.myReaction;

  if (mergeNoteReactions) {
    const map: Record<string, number> = {};
    for (const [reaction, count] of reactions) {
      const [normalizedName] = normalizeEmojiName(reaction);
      if (!emojisMap.has(normalizedName)) {
        map[reaction] = count;
        continue;
      }
      const name = `:${normalizedName}:`;
      if (myReaction === reaction) {
        myReaction = name;
      }
      map[name] = (map[name] ?? 0) + count;
    }
    reactions = Object.entries(map);
  }

  if (disableReactions) {
    return null;
  }

  reactions.sort(([, a], [, b]) => b - a);

  return (
    <div className="mk-note-reactions flex flex-wrap gap-1 px-2 pb-2">
      {reactions.map(([reaction, count]) => (
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
