import { Image } from '@heroui/image'
import clsx from 'clsx'
import type { DriveFile } from 'misskey-js/entities.js'
import type { HTMLProps } from 'react'

export const MkImage = (props: { image: DriveFile } & HTMLProps<HTMLDivElement>) => {
  const { image, className, ...rest } = props

  return (
    <div
      className={clsx('mk-image w-full flex items-center justify-center bg-muted rounded-md overflow-hidden', className)}
      {...rest}
    >
      <Image src={image.thumbnailUrl || image.url} alt={image.name || ''} />
    </div>
  )
}
