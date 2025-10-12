import type { EmojiSimple } from 'misskey-js/entities.js'
import { MkEmojiPicker } from './mk-emoji-picker'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

export const MkEmojiPickerPopup = (props: {
  onEmojiChoose: (emoji: EmojiSimple) => void
  autoClose?: boolean
  children: React.ReactNode
}) => {
  const [show, setShow] = useState(false)

  function onEmojiChoose(emoji: EmojiSimple) {
    props.onEmojiChoose(emoji)
    if (props.autoClose)
      setShow(false)
  }

  return (
    <Popover open={show} onOpenChange={setShow}>
      <PopoverTrigger asChild>
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="w-fit h-fit">
        <MkEmojiPicker onEmojiChoose={onEmojiChoose} />
      </PopoverContent>
    </Popover>
  )
}
