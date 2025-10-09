import type { User } from 'misskey-js/entities.js'
import type { HTMLProps } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const MkAvatar = (
  props: { user: User } & HTMLProps<HTMLSpanElement>,
) => {
  const { user, ...rest } = props

  return (
    <Avatar {...rest}>
      <AvatarFallback>
        <div>{user.name}</div>
      </AvatarFallback>
      <AvatarImage src={user.avatarUrl}></AvatarImage>
    </Avatar>
  )
}
