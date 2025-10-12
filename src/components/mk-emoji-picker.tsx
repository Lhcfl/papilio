import type { HTMLProps } from 'react'
import { MkCustomEmoji, MkEmoji } from './mk-emoji'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { ScrollArea } from './ui/scroll-area'
import type { EmojiSimple } from 'misskey-js/entities.js'
import { FolderIcon, SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from './ui/input-group'
import { useDebounce } from 'react-use'
import { Spinner } from './ui/spinner'
import { emojiCharByCategory, emojilist as UnicodeEmojiList } from '@/assets/emojilist'
import { Separator } from '@/components/ui/separator'

type RecurisveEmojiCategories = {
  [name: string]:
  {
    emojis: EmojiSimple[]
    subcategories: RecurisveEmojiCategories
  }
}

type EmojisByCategory = {
  [category: string]: EmojiSimple[]
}

const UNCATEGORIZED = '__uncategorized_key'
const UNNAMED = '__unnamed_key'

export const MkEmojiPicker = (props: {
  onEmojiChoose: (emoji: EmojiSimple | string) => void
} & HTMLProps<HTMLDivElement>) => {
  const { onEmojiChoose, ...rest } = props
  const customEmojis = useEmojis(s => s.emojis)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [search, setSearch] = useState('')
  const { t } = useTranslation()

  const OTHER_CATEGORY_I18N = t('other')

  useDebounce(() => {
    setDebouncedSearch(search.toLocaleLowerCase())
  }, 300, [search])

  const debouncing = search !== debouncedSearch

  const emojisByCategory = useMemo(() => {
    const ret: EmojisByCategory = {}
    for (const emoji of customEmojis) {
      const category = emoji.category || OTHER_CATEGORY_I18N
      ret[category] = ret[category] || []
      ret[category].push(emoji)
    }
    return ret
  }, [customEmojis, OTHER_CATEGORY_I18N])

  const customEmojisRecursiveByCategory = useMemo(() => {
    const ret: RecurisveEmojiCategories = { }

    const emojisSorted = [...customEmojis].sort((a, b) =>
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
  }, [customEmojis])

  const searchedEmojis = useMemo(() => {
    if (debouncedSearch.trim() === '') {
      return null
    }

    const customNameHit = customEmojis.filter(e =>
      e.name.toLocaleLowerCase().includes(debouncedSearch)
      || e.aliases.some(a => a.toLocaleLowerCase().includes(debouncedSearch)),
    ).slice(0, 200)

    const unicodeNameHit = UnicodeEmojiList.filter(e =>
      // they are already lowercased
      e.name.includes(debouncedSearch),
    ).slice(0, 200).map(e => e.char)

    const categoryHit = Object.keys(emojisByCategory).filter(c => c.toLocaleLowerCase().includes(debouncedSearch))

    return { customNameHit, unicodeNameHit, categoryHit }
  }, [debouncedSearch, customEmojis, emojisByCategory])

  return (
    <div className="mk-emoji-picker" {...rest}>
      <InputGroup>
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupInput onInput={e => setSearch(e.currentTarget.value)} />
        {debouncing && (
          <InputGroupAddon align="inline-end">
            <Spinner />
          </InputGroupAddon>
        )}
      </InputGroup>
      <ScrollArea className="mt-2 h-100 w-100 max-h-100 max-w-100 lg:w-120 lg:h-120 lg:max-h-120 lg:max-w-120">
        {searchedEmojis
          ? (
              <div>
                {searchedEmojis.unicodeNameHit.length > 0 && (
                  <MkEmojiPickerEmojis
                    unicodeEmojis={searchedEmojis.unicodeNameHit}
                    onEmojiChoose={onEmojiChoose}
                  />
                )}
                {searchedEmojis.customNameHit.length > 0 && (
                  <MkEmojiPickerEmojis
                    emojis={searchedEmojis.customNameHit}
                    onEmojiChoose={onEmojiChoose}
                  />
                )}
                {searchedEmojis.categoryHit.length > 0 && (
                  <Accordion type="multiple" className="w-full mt-2">
                    {searchedEmojis.categoryHit.map(c => (
                      <MkEmojiPickerFolder
                        key={c}
                        name={c}
                        ctnt={{ emojis: emojisByCategory[c], subcategories: {} }}
                        value={c}
                        onEmojiChoose={onEmojiChoose}
                      />
                    ))}
                  </Accordion>
                )}
              </div>
            )
          : (
              <Accordion type="multiple" className="w-full">
                {Object.entries(customEmojisRecursiveByCategory).map(([k, v]) => (
                  <MkEmojiPickerFolder
                    key={k}
                    name={k}
                    ctnt={v}
                    onEmojiChoose={onEmojiChoose}
                    value={k || UNNAMED}
                  />
                ))}
                <Separator />
                {[...emojiCharByCategory.entries()].map(([k, v]) => (
                  <AccordionItem key={k} value={k}>
                    <AccordionTrigger className="p-1">
                      <div className="flex items-center gap-2 w-full">
                        <MkEmoji emoji={v[0]} className="min-w-8" />
                        <span>{k}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <MkEmojiPickerEmojis
                        unicodeEmojis={v}
                        onEmojiChoose={onEmojiChoose}
                      />
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
      </ScrollArea>
    </div>
  )
}

const MkEmojiPickerFolder = (props: {
  name: string
  ctnt: RecurisveEmojiCategories[string]
  onEmojiChoose: (emoji: EmojiSimple | string) => void
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
        <MkEmojiPickerEmojis emojis={emojis} onEmojiChoose={onEmojiChoose} />
      </AccordionContent>
    </AccordionItem>
  )
}

const MkEmojiPickerEmojis = ({ emojis, unicodeEmojis, onEmojiChoose }: {
  emojis?: EmojiSimple[]
  unicodeEmojis?: string[]
  onEmojiChoose: (emoji: EmojiSimple | string) => void
}) => (
  <div className="grid grid-cols-[repeat(auto-fit,calc(var(--spacing)_*_14))] gap-1">
    {emojis?.map(emoji => (
      <button
        key={emoji.name}
        className="p-1 rounded-md hover:bg-muted size-14"
        onClick={() => onEmojiChoose(emoji)}
      >
        <MkCustomEmoji name={emoji.name} fallbackToImage />
      </button>
    ))}
    {unicodeEmojis?.map(emoji => (
      <button
        key={emoji}
        className="p-1 rounded-md hover:bg-muted size-14 overflow-hidden"
        onClick={() => onEmojiChoose(emoji)}
      >
        <MkEmoji emoji={emoji} innerClassName="h-[2em]" />
      </button>
    ))}
  </div>
)
