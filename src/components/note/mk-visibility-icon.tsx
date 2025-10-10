import { EyeOffIcon, GlobeIcon, HomeIcon, LockIcon, MessageSquareIcon } from 'lucide-react'
import type { HTMLProps } from 'react'

export const MkVisibilityIcon = (props: { note: NoteWithExtension } & HTMLProps<SVGSVGElement>) => {
  const { note, ...rest } = props
  const meId = useMe(me => me.id)
  const isPrivate = !note.visibleUserIds?.some(x => x !== meId)
  switch (note.visibility) {
    case 'public':
      return <GlobeIcon {...rest} />
    case 'home':
      return <HomeIcon {...rest} />
    case 'followers':
      return <LockIcon {...rest} />
    case 'specified':
      return isPrivate ? <EyeOffIcon {...rest} /> : <MessageSquareIcon {...rest} />
  }
}
