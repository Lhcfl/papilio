import clsx from 'clsx'
import type { DriveFile } from 'misskey-js/entities.js'
import type { HTMLProps } from 'react'
import { MkImage } from '../mk-image'

export const MkNoteImages = (props: { images: DriveFile[] } & HTMLProps<HTMLDivElement>) => {
  const { images, className: classNameProp, ...rest } = props
  const count = images.length

  const aspectRatio = (image: DriveFile) => {
    const { width, height } = image.properties
    if (!width || !height) return 4 / 3
    return width / height
  }

  const className = clsx('mk-note-images w-full text-center gap-2', classNameProp, {
    'images-1': count === 1,
    'images-2 aspect-[4/3] grid': count === 2,
    'grid-cols-2': count === 2
      && !(aspectRatio(images[0]) > 1.5 && aspectRatio(images[1]) > 1.5),
    'grid-rows-2': count === 2
      && aspectRatio(images[0]) > 1.5 && aspectRatio(images[1]) > 1.5,
    'images-3 aspect-[4/3] grid grid-cols-2 ': count === 3,
    'images-4 aspect-[4/3] grid grid-cols-2 grid-rows-2': count === 4,
    'images-many grid grid-cols-2': count > 5,
  })

  if (count === 0) return null

  return (
    <div className={className} data-images-count={count} {...rest}>
      {images.map((image, index) => (
        <MkImage
          key={image.id}
          image={image}
          className={clsx({ 'row-span-2': count === 3 && index === 0 })}
        />
      ))}
    </div>
  )
}
