import clsx from 'clsx'
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react'
import type { DriveFile } from 'misskey-js/entities.js'
import type { HTMLProps } from 'react'
import Lightbox from 'react-spring-lightbox'
import { MkImage } from '../mk-image'
import { ScrollArea } from '../ui/scroll-area'

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
    'images-2 aspect-[16/9] grid': count === 2,
    'grid-cols-2': count === 2 && !(aspectRatio(images[0]) > 1.5 && aspectRatio(images[1]) > 1.5),
    'grid-rows-2': count === 2 && aspectRatio(images[0]) > 1.5 && aspectRatio(images[1]) > 1.5,
    'images-3 aspect-[16/9] grid grid-cols-2 ': count === 3,
    'images-4 aspect-[16/9] grid grid-cols-2 grid-rows-2': count === 4,
    'images-many grid grid-cols-2': count > 5,
  })

  const [open, setOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (count === 0) return null

  const lightboxImages = images.map(img => ({
    src: img.url,
    alt: img.comment || img.name,
    width: img.properties.width || 800,
    height: img.properties.height || 600,
  }))

  const handleNext = () => setCurrentIndex(prev => (prev + 1) % lightboxImages.length)
  const handlePrev = () => setCurrentIndex(prev => (prev - 1 + lightboxImages.length) % lightboxImages.length)

  return (
    <>
      <div className={className} data-images-count={count} {...rest}>
        {images.map((image, index) => (
          <MkImage
            key={image.id}
            image={image}
            className={clsx('cursor-zoom-in', { 'row-span-2': count === 3 && index === 0 })}
            onClick={() => {
              setOpen(true)
              setCurrentIndex(index)
            }}
          />
        ))}
      </div>
      <Lightbox
        className="bg-black/30"
        images={lightboxImages}
        currentIndex={currentIndex}
        isOpen={open}
        onNext={handleNext}
        onPrev={handlePrev}
        onClose={() => setOpen(false)}
        renderNextButton={() => count != 1 && (
          <button type="button" className="z-999 p-3" onClick={handleNext}>
            <ChevronRightIcon className="text-white size-10" />
          </button>
        )}
        renderPrevButton={() => count != 1 && (
          <button type="button" className="z-999 p-3" onClick={handlePrev}>
            <ChevronLeftIcon className="text-white size-10" />
          </button>
        )}
        renderHeader={() => (
          <div className="w-full flex justify-between absolute top-0 left-0 z-999">
            <div className="flex items-center ml-2">
              <span className="px-2 py-1 rounded-full bg-black/20 text-white text-lg backdrop-blur-sm">
                {currentIndex + 1}
                {' '}
                /
                {' '}
                {count}
              </span>
            </div>
            <button type="button" className="z-999 p-3" onClick={() => setOpen(false)}>
              <XIcon className="text-white size-10" />
            </button>
          </div>
        )}
        renderFooter={() => (
          <div className="w-full flex justify-center absolute bottom-0 left-0 z-999 mb-3">
            <div className="px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm max-w-[80%] max-h-20 overflow-hidden">
              <ScrollArea>
                <p>
                  {images[currentIndex].comment || images[currentIndex].name}
                </p>
              </ScrollArea>
            </div>
          </div>
        )}
      />
    </>
  )
}
