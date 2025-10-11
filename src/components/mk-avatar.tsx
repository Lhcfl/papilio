import type { User } from 'misskey-js/entities.js'
import type { HTMLProps } from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { MkBlurHash } from './mk-blurhash'
import * as AvatarPrimitive from '@radix-ui/react-avatar'

export const MkAvatar = (
  props: { user: User } & HTMLProps<HTMLSpanElement>,
) => {
  const { user, ...rest } = props

  return (
    <Avatar {...rest}>
      <AvatarPrimitive.Fallback className="relative overflow-hidden">
        <MkBlurHash id={'user:' + user.id} blurhash={user.avatarBlurhash} className="w-full h-full" />
      </AvatarPrimitive.Fallback>
      <AvatarImage src={user.avatarUrl} loading="lazy" decoding="async" />
    </Avatar>
  )
}
