import { useEffect, useRef } from 'react';

import drawBlurHash from '@/workers/draw-blurhash?worker&inline';
import type { HTMLProps } from 'react';

export const MkBlurHash = (
  props: {
    id: string;
    blurhash: string | null;
    width?: number | null;
    height?: number | null;
  } & HTMLProps<HTMLCanvasElement>,
) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { id, blurhash, width = null, height = null, ...rest } = props;
  const ratio = width && height ? width / height : 1;
  const drawWidth = ratio > 1 ? Math.round(64 * ratio) : 64;
  const drawHeight = ratio > 1 ? 64 : Math.round(64 / ratio);

  useEffect(() => {
    const worker = new drawBlurHash();
    worker.postMessage({
      id,
      hash: blurhash,
    });
    worker.addEventListener('message', (ev) => {
      const bitmap = (ev.data as { bitmap: CanvasImageSource }).bitmap;
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(bitmap, 0, 0, drawWidth, drawHeight);
    });
    return () => {
      worker.terminate();
    };
  }, [blurhash, drawHeight, drawWidth, id]);

  return (
    <canvas
      className="object-cover"
      draggable={false}
      tabIndex={-1}
      ref={canvasRef}
      width={drawWidth}
      height={drawHeight}
      {...rest}
    />
  );
};
