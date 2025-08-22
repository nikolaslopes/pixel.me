import { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { IMAGE_DEFAULT_SETTINGS, IMAGE_PRESETS } from '../_lib/constants';
import { ImagePresetName, PixelArtSettings } from '../_lib/types';
import { useImageProcessor } from './useImageProcessor';

export function useHomeController() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [settings, setSettings] = useState<PixelArtSettings>(IMAGE_DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState<ImagePresetName | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { t } = useTranslation();

  const {
    loading,
    error,
    pixelArtImage,
    canvasRef,
    convertToPixelArt,
    setError,
    setPixelArtImage,
  } = useImageProcessor();

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type.startsWith('image/')) {
      setError(null);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            setOriginalImage(img);
            convertToPixelArt(img, settings);
          };
          img.onerror = () => {
            setError(t('errors.imageLoad'));
          };
          img.src = result;
        }
      };
      reader.onerror = () => {
        setError(t('errors.fileRead'));
      };
      reader.readAsDataURL(file);
    } else {
      setError(t('errors.invalidFileType'));
    }
  };

  function handleSettingsChange(key: keyof PixelArtSettings, value: number | boolean) {
    const newSettings: PixelArtSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setActivePreset(null);

    if (originalImage) convertToPixelArt(originalImage, newSettings);
  }

  function handleResetSettings() {
    setSettings(IMAGE_DEFAULT_SETTINGS);

    if (originalImage) {
      convertToPixelArt(originalImage, IMAGE_DEFAULT_SETTINGS);
    }
  }

  function handleDownloadImage() {
    if (!pixelArtImage) return;

    const link: HTMLAnchorElement = document.createElement('a');
    link.href = pixelArtImage;
    link.download = `pixel-art-${Date.now()}.png`;
    link.click();
  }

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleAddNewImage() {
    setOriginalImage(null);
    setPixelArtImage(null);
    setError(null);
    setSettings(IMAGE_DEFAULT_SETTINGS);
    setActivePreset(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function applyPreset(name: ImagePresetName) {
    if (activePreset === name) {
      setActivePreset(null);
      setSettings(IMAGE_DEFAULT_SETTINGS);

      if (originalImage) {
        convertToPixelArt(originalImage, IMAGE_DEFAULT_SETTINGS);
      }

      return;
    }

    const preset = IMAGE_PRESETS[name];
    setSettings(preset);
    setActivePreset(name);

    if (originalImage) {
      convertToPixelArt(originalImage, preset);
    }
  }

  return {
    loading,
    error,
    canvasRef,
    fileInputRef,
    originalImage,
    settings,
    activePreset,
    pixelArtImage,
    handleImageUpload,
    handleSettingsChange,
    handleResetSettings,
    handleDownloadImage,
    handleUploadClick,
    handleAddNewImage,
    applyPreset,
  };
}
