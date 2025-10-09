import clsx from 'clsx'
import Twemoji from 'twemoji'
import { getUserSite } from '@/services/use-misskey-api'

export const MkCustomEmoji = (props: {
  name: string
  normal?: boolean
  noStyle?: boolean
  host?: string | null
  url?: string
  useOriginalSize?: boolean
  menu?: boolean
  menuReaction?: boolean
  fallbackToImage?: boolean
}) => {
  const className = clsx('inline align-middle transition-all', props.normal ? 'h-[1.25em] align-[-0.25em]' : 'h-[2em]')
  const { emojisMap, site, meta } = useMisskeyGlobal()
  const [error, setError] = useState(false)

  const name = props.name[0] === ':' ? props.name.slice(1, -1) : props.name
  const isLocal = props.host == null && (name.endsWith('@.') || name.includes('@'))
  const url = props.url
    ? props.url
    : isLocal
      ? emojisMap.get(name)?.url
      : new URL(props.host ? `/emoji/${name}@${props.host}.webp` : `/emoji/${name}.webp`, site).toString()
  const alt = `:${name}:`

  if ((!url || error) && props.fallbackToImage && meta.notFoundImageUrl) {
    return (
      <span className="mk-custom-emoji error mk-custom-emoji-fallback">
        <img className={className} src={meta.notFoundImageUrl} alt={alt} title={alt} decoding="async" />
      </span>
    )
  }

  if (url) {
    return (
      <span className="mk-custom-emoji">
        <img
          className={className}
          src={url}
          alt={alt}
          title={alt}
          decoding="async"
          onError={() => setError(true)}
          onLoad={() => setError(false)}
        />
      </span>
    )
  }

  return <span className="mk-custom-emoji error">{alt}</span>
}

export const MkEmoji = (props: { emoji: string, menu?: boolean, menuReaction?: boolean }) => {
  const parsed = Twemoji.parse(props.emoji, {
    base: getUserSite(),
    ext: '.svg',
    folder: '/twemoji',
    className: 'h-[1.25em] align-[-0.25em] transition-all inline',
  })
  return <span className="mk-emoji" dangerouslySetInnerHTML={{ __html: parsed }} />
}
