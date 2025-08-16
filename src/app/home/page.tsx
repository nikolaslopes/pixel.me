'use client';

import React, { useState, useRef, useCallback, ChangeEvent } from 'react';

import '@/i18n/config';
import { Header } from './_components/Header';
import { ErrorMessage } from './_components/ErrorMessage';
import { UploadSection } from './_components/UploadSection';
import { SettingsGroup } from './_components/SettingsGroup';
import { ImageGroup } from './_components/ImageGroup';
import { Footer } from './_components/Footer';
import { ImagePresetName, PixelArtSettings } from './_lib/types';
import { IMAGE_DEFAULT_SETTINGS, IMAGE_PRESETS } from './_lib/constants';

const applyDithering = (
  data: Uint8ClampedArray,
  width: number,
  height: number,
  colorStep: number
): void => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;

      // Processar cada canal de cor
      for (let channel = 0; channel < 3; channel++) {
        const oldPixel = data[i + channel];
        const newPixel = Math.round(oldPixel / colorStep) * colorStep;
        const error = oldPixel - newPixel;

        data[i + channel] = Math.max(0, Math.min(255, newPixel));

        // Distribuir erro para pixels adjacentes
        if (x + 1 < width) {
          data[i + 4 + channel] += (error * 7) / 16;
        }
        if (y + 1 < height) {
          if (x > 0) {
            data[((y + 1) * width + (x - 1)) * 4 + channel] += (error * 3) / 16;
          }
          data[((y + 1) * width + x) * 4 + channel] += (error * 5) / 16;
          if (x + 1 < width) {
            data[((y + 1) * width + (x + 1)) * 4 + channel] += (error * 1) / 16;
          }
        }
      }
    }
  }
};

const normalizeColor = (value: number): number => {
  return Math.max(0, Math.min(255, Math.round(value)));
};

const Home: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null);
  const [pixelArtImage, setPixelArtImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<PixelArtSettings>(IMAGE_DEFAULT_SETTINGS);
  const [activePreset, setActivePreset] = useState<ImagePresetName | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
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
            setError('Erro ao carregar a imagem. Tente uma imagem diferente.');
          };
          img.src = result;
        }
      };
      reader.onerror = () => {
        setError('Erro ao ler o arquivo. Tente novamente.');
      };
      reader.readAsDataURL(file);
    } else {
      setError('Por favor, selecione um arquivo de imagem válido.');
    }
  };

  const convertToPixelArt = useCallback(
    (img: HTMLImageElement, currentSettings: PixelArtSettings): void => {
      if (!img || !canvasRef.current) return;

      setLoading(true);
      setError(null);

      //  setTimeout para não bloquear a UI
      setTimeout(() => {
        try {
          const canvas = canvasRef.current;
          if (!canvas) {
            setError('Erro interno: canvas não disponível');
            setLoading(false);
            return;
          }

          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            setError('Erro interno: contexto 2D não disponível');
            setLoading(false);
            return;
          }

          // Calcular dimensões mantendo aspect ratio
          const maxSize = 800;
          let { width, height } = img;

          if (width > height) {
            if (width > maxSize) {
              height = (height * maxSize) / width;
              width = maxSize;
            }
          } else {
            if (height > maxSize) {
              width = (width * maxSize) / height;
              height = maxSize;
            }
          }

          // Ajustar dimensões para serem múltiplos do pixel size
          const pixelSize = currentSettings.pixelSize;
          width = Math.floor(width / pixelSize) * pixelSize;
          height = Math.floor(height / pixelSize) * pixelSize;

          canvas.width = width;
          canvas.height = height;

          // Limpar canvas
          ctx.clearRect(0, 0, width, height);

          // Desenhar imagem original
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, 0, 0, width, height);

          // Obter dados da imagem
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          ctx.putImageData(imageData, 0, 0); // sem precisar do construtor

          // Aplicar filtros de cor primeiro
          for (let i = 0; i < data.length; i += 4) {
            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];
            const a = data[i + 3];

            // Pular pixels transparentes
            if (a === 0) continue;

            // Aplicar brilho
            r *= currentSettings.brightness;
            g *= currentSettings.brightness;
            b *= currentSettings.brightness;

            // Aplicar contraste
            r = ((r / 255 - 0.5) * currentSettings.contrast + 0.5) * 255;
            g = ((g / 255 - 0.5) * currentSettings.contrast + 0.5) * 255;
            b = ((b / 255 - 0.5) * currentSettings.contrast + 0.5) * 255;

            // Aplicar saturação
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;
            r = gray + currentSettings.saturation * (r - gray);
            g = gray + currentSettings.saturation * (g - gray);
            b = gray + currentSettings.saturation * (b - gray);

            // Normalizar valores
            data[i] = normalizeColor(r);
            data[i + 1] = normalizeColor(g);
            data[i + 2] = normalizeColor(b);
          }

          // Aplicar dithering se ativado
          const colorStep = Math.floor(256 / currentSettings.colorReduction);
          if (currentSettings.dithering) {
            applyDithering(data, width, height, colorStep);
          }

          // Aplicar efeito pixel art (pixelização)
          for (let y = 0; y < height; y += pixelSize) {
            for (let x = 0; x < width; x += pixelSize) {
              let r = 0,
                g = 0,
                b = 0,
                a = 0,
                count = 0;

              // Calcular cor média do bloco
              for (let py = y; py < Math.min(y + pixelSize, height); py++) {
                for (let px = x; px < Math.min(x + pixelSize, width); px++) {
                  const i = (py * width + px) * 4;
                  if (data[i + 3] > 0) {
                    // Só considerar pixels não transparentes
                    r += data[i];
                    g += data[i + 1];
                    b += data[i + 2];
                    a += data[i + 3];
                    count++;
                  }
                }
              }

              if (count > 0) {
                // Cor média
                r = Math.floor(r / count);
                g = Math.floor(g / count);
                b = Math.floor(b / count);
                a = Math.floor(a / count);

                // Reduzir paleta de cores (se não usando dithering)
                if (!currentSettings.dithering) {
                  r = Math.floor(r / colorStep) * colorStep;
                  g = Math.floor(g / colorStep) * colorStep;
                  b = Math.floor(b / colorStep) * colorStep;
                }

                // Aplicar cor ao bloco
                for (let py = y; py < Math.min(y + pixelSize, height); py++) {
                  for (let px = x; px < Math.min(x + pixelSize, width); px++) {
                    const i = (py * width + px) * 4;
                    data[i] = r;
                    data[i + 1] = g;
                    data[i + 2] = b;
                    data[i + 3] = a;
                  }
                }
              }
            }
          }

          // Aplicar dados modificados
          const newImageData = new ImageData(data, width, height);

          ctx.putImageData(newImageData, 0, 0);

          // Converter para imagem
          canvas.toBlob(
            (blob: Blob | null) => {
              if (blob) {
                // Revogar URL anterior se existir
                if (pixelArtImage) {
                  URL.revokeObjectURL(pixelArtImage);
                }
                const url: string = URL.createObjectURL(blob);
                setPixelArtImage(url);
              } else {
                setError('Erro ao gerar a imagem pixel art');
              }
              setLoading(false);
            },
            'image/png',
            1.0
          );
        } catch (err) {
          console.error('Erro durante conversão:', err);
          setError('Erro durante a conversão. Tente ajustar as configurações.');
          setLoading(false);
        }
      }, 50);
    },
    [pixelArtImage]
  );

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="mx-auto max-w-6xl">
        <Header />

        {error && <ErrorMessage message={error} />}

        <main>
          <UploadSection
            fileInputRef={fileInputRef}
            onUploadClick={handleUploadClick}
            onImageUpload={handleImageUpload}
          />

          {originalImage && (
            <SettingsGroup
              onResetSettings={handleResetSettings}
              onAddNewImage={handleAddNewImage}
              settings={settings}
              activePreset={activePreset}
              onSettingsChange={handleSettingsChange}
              onPresetChange={applyPreset}
            />
          )}

          <ImageGroup
            loading={loading}
            originalImage={originalImage}
            pixelArtImage={pixelArtImage}
            onDownload={handleDownloadImage}
          />

          <canvas ref={canvasRef} className="hidden" />
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
