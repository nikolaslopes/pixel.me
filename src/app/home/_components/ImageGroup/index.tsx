import React from 'react';
import { OriginalImageCard } from './OriginalImageCard';
import { PixelArtCard } from './PixelArtCard';

interface ImageGroupProps {
  loading: boolean;
  originalImage: HTMLImageElement | null;
  pixelArtImage: string | null;
  onDownload: () => void;
}

export const ImageGroup: React.FC<ImageGroupProps> = ({
  loading,
  originalImage,
  pixelArtImage,
  onDownload,
}) => {
  if (!originalImage) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <OriginalImageCard src={originalImage.src} />

      {(pixelArtImage || loading) && (
        <PixelArtCard src={pixelArtImage} loading={loading} onDownload={onDownload} />
      )}
    </div>
  );
};
