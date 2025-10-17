import { ChevronLeftIcon, ChevronRightIcon, XIcon } from 'lucide-react';
import type { DriveFile } from 'misskey-js/entities.js';
import Lightbox from 'react-spring-lightbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MkBlurHash } from '@/components/mk-blurhash';

export const ImagesLightbox = (props: {
  images: DriveFile[];
  open: boolean;
  setOpen: (v: boolean) => void;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
}) => {
  const { images, open, setOpen, currentIndex, setCurrentIndex } = props;
  const count = images.length;

  if (count === 0) return null;

  const lightboxImages = images.map((img) => ({
    src: img.url,
    alt: img.comment ?? img.name,
    width: img.properties.width ?? 800,
    height: img.properties.height ?? 600,
  }));

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % lightboxImages.length);
  };
  const handlePrev = () => {
    setCurrentIndex((currentIndex - 1 + lightboxImages.length) % lightboxImages.length);
  };

  return (
    <Lightbox
      className="bg-black/30"
      images={lightboxImages}
      currentIndex={currentIndex}
      isOpen={open}
      onNext={handleNext}
      onPrev={handlePrev}
      onClose={() => {
        setOpen(false);
      }}
      renderNextButton={() =>
        count != 1 && (
          <button type="button" className="z-999 p-3" onClick={handleNext}>
            <ChevronRightIcon className="text-white size-10" />
          </button>
        )
      }
      renderPrevButton={() =>
        count != 1 && (
          <button type="button" className="z-999 p-3" onClick={handlePrev}>
            <ChevronLeftIcon className="text-white size-10" />
          </button>
        )
      }
      renderHeader={() => (
        <div className="w-full flex justify-between absolute top-0 left-0 z-999">
          <div className="flex items-center ml-2">
            <span className="px-2 py-1 rounded-full bg-black/20 text-white text-lg backdrop-blur-sm">
              {currentIndex + 1} / {count}
            </span>
          </div>
          <button
            type="button"
            className="z-999 p-3"
            onClick={() => {
              setOpen(false);
            }}
          >
            <XIcon className="text-white size-10" />
          </button>
        </div>
      )}
      renderFooter={() => (
        <div className="w-full flex justify-center absolute bottom-0 left-0 z-999 mb-3">
          <div className="px-2 py-1 rounded-md bg-black/40 text-white backdrop-blur-sm max-w-[80%] max-h-20 overflow-hidden">
            <ScrollArea>
              <p>{images[currentIndex].comment ?? images[currentIndex].name}</p>
            </ScrollArea>
          </div>
        </div>
      )}
      renderImageOverlay={() => (
        <MkBlurHash
          className="absolute w-full h-full -z-10"
          id={'image:' + images[currentIndex].id}
          blurhash={images[currentIndex].blurhash}
        />
      )}
    />
  );
};
