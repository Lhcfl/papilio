import type { HTMLProps } from 'react'
import { MkCustomEmoji } from './mk-emoji'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { ScrollArea } from './ui/scroll-area'
import type { EmojiSimple } from 'misskey-js/entities.js'
import { FolderIcon } from 'lucide-react'

type RecurisveEmojiCategories = {
  [name: string]:
  {
    emojis: EmojiSimple[]
    subcategories: RecurisveEmojiCategories
  }
}

const UNCATEGORIZED = '__uncategorized_key'
const UNNAMED = '__unnamed_key'

export const MkEmojiPicker = (props: {
  onEmojiChoose: (emoji: EmojiSimple) => void
} & HTMLProps<HTMLDivElement>) => {
  const { onEmojiChoose, ...rest } = props
  const emojis = useEmojis(s => s.emojis)
  // const { t } = useTranslation()
  const emojisByCategory = useMemo(() => {
    const ret: RecurisveEmojiCategories = { }

    const emojisSorted = [...emojis].sort((a, b) =>
      a.category == null
        ? 1
        : b.category == null
          ? -1
          : a.category.localeCompare(b.category),
    )

    for (const emoji of emojisSorted) {
      const categoryPath = emoji.category?.split('/') || [UNCATEGORIZED]
      let current = ret
      let currentEmojis: RecurisveEmojiCategories[string]['emojis'] = []
      for (const p of categoryPath) {
        current[p] = current[p] || { emojis: [], subcategories: { } }
        currentEmojis = current[p].emojis
        current = current[p].subcategories
      }
      currentEmojis.push(emoji)
    }

    return ret
  }, [emojis])

  return (
    <div className="mk-emoji-picker" {...rest}>
      <ScrollArea className="h-100 w-100 max-h-100 max-w-100 lg:w-120 lg:h-120 lg:max-h-120 lg:max-w-120">
        <Accordion type="multiple" className="w-full">
          {Object.entries(emojisByCategory).map(([k, v]) => (
            <MkEmojiPickerFolder
              key={k}
              name={k}
              ctnt={v}
              onEmojiChoose={onEmojiChoose}
              value={k || UNNAMED}
            />
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  )
}

export const MkEmojiPickerFolder = (props: {
  name: string
  ctnt: RecurisveEmojiCategories[string]
  onEmojiChoose: (emoji: EmojiSimple) => void
} & React.ComponentProps<typeof AccordionItem>) => {
  const { name, ctnt, onEmojiChoose, ...rest } = props
  const { t } = useTranslation()
  const realName = (name === UNCATEGORIZED ? t('other') : name) || t('unknown')
  const { emojis, subcategories } = ctnt
  const lines = Object.entries(subcategories)
  const Representation = emojis.length > 0
    ? <MkCustomEmoji name={emojis[0].name} fallbackToImage />
    : <FolderIcon className="size-4" />

  return (
    <AccordionItem {...rest}>
      <AccordionTrigger className="p-1">
        <div className="flex items-center gap-2 w-full">
          <span className="min-w-8">{Representation}</span>
          <span>{realName}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {lines.length > 0 && (
          <Accordion type="multiple" className="w-full pl-2">
            {lines.map(([k, v]) => (
              <MkEmojiPickerFolder
                key={k}
                name={k}
                ctnt={v}
                onEmojiChoose={onEmojiChoose}
                value={k || UNNAMED}
              />
            ))}
          </Accordion>
        )}
        <div className="grid grid-cols-[repeat(auto-fit,calc(var(--spacing)_*_14))] gap-1">
          {emojis.map(emoji => (
            <button
              key={emoji.name}
              className="p-1 rounded-md hover:bg-muted size-14"
              onClick={() => onEmojiChoose(emoji)}
            >
              <MkCustomEmoji name={emoji.name} fallbackToImage />
            </button>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
