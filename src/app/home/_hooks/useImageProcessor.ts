import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { PixelArtSettings } from '../_lib/types';
import { ImageProcessor } from '../_lib/ImageProcessor';

export const useImageProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pixelArtImage, setPixelArtImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { t } = useTranslation();

  const convertToPixelArt = useCallback(
    async (img: HTMLImageElement, settings: PixelArtSettings): Promise<void> => {
      if (!img || !canvasRef.current) return;

      setLoading(true);
      setError(null);

      try {
        if (pixelArtImage) {
          URL.revokeObjectURL(pixelArtImage);
        }

        const url = await ImageProcessor.processImage(canvasRef.current, img, settings);
        setPixelArtImage(url);
      } catch {
        setError(t('errors.conversion'));
      } finally {
        setLoading(false);
      }
    },
    [pixelArtImage, t]
  );

  return {
    loading,
    error,
    pixelArtImage,
    canvasRef,
    convertToPixelArt,
    setError,
    setPixelArtImage,
  };
};
