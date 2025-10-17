import { useEmojis } from '@/stores/emojis';
import { ScrollArea } from './ui/scroll-area';
import { MkCustomEmoji } from './mk-emoji';
import type { EmojiSimple } from 'misskey-js/entities.js';

export const MkCustomEmojiSearchPopup = (props: {
  open: boolean;
  query: string;
  children: React.ReactNode;
  onSelect: (emoji: EmojiSimple) => void;
}) => {
  const emojis = useEmojis((s) => s.emojis);
  const filteredEmojis = emojis.filter((e) => e.name.startsWith(props.query));

  return (
    <ScrollArea className="max-h-96 w-64">
      {filteredEmojis.map((e) => (
        <div key={e.name} className="flex items-center gap-2">
          <MkCustomEmoji name={e.name} normal fallbackToImage innerClassName="h-[1.5em]" />
          <span>{e.name}</span>
        </div>
      ))}
    </ScrollArea>
  );
};
