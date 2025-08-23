import { PixelArtSettings, ImagePresetName } from './types';

export const IMAGE_DEFAULT_SETTINGS: PixelArtSettings = {
  pixelSize: 8,
  colorReduction: 16,
  brightness: 1,
  contrast: 1,
  saturation: 1,
  dithering: false,
};

export const IMAGE_PRESETS: Record<ImagePresetName, PixelArtSettings> = {
  NES: {
    pixelSize: 6,
    colorReduction: 24,
    brightness: 1,
    contrast: 1.1,
    saturation: 1,
    dithering: false,
  },
  GameBoy: {
    pixelSize: 6,
    colorReduction: 4,
    brightness: 1,
    contrast: 1.1,
    saturation: 0.2,
    dithering: true,
  },
  C64: {
    pixelSize: 8,
    colorReduction: 16,
    brightness: 1,
    contrast: 1.15,
    saturation: 1.2,
    dithering: true,
  },
  Mono: {
    pixelSize: 8,
    colorReduction: 8,
    brightness: 1,
    contrast: 1,
    saturation: 0,
    dithering: false,
  },
  Arcade: {
    pixelSize: 4,
    colorReduction: 32,
    brightness: 1.1,
    contrast: 1.2,
    saturation: 1.3,
    dithering: true,
  },
};
