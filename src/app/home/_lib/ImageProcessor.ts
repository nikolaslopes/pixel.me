import { PixelArtSettings } from './types';

enum Channel {
  R = 0,
  G = 1,
  B = 2,
  A = 3,
}

const RGBA_CHANNELS = 4;

const RGB_CHANNELS = 3;

const MAX_COLOR_VALUE = 255;

const COLOR_VALUES_PER_CHANNEL = 256;

const LUMINANCE_COEFF = {
  R: 0.299,
  G: 0.587,
  B: 0.114,
};

const DITHER_COEFF = {
  RIGHT: 7 / 16,
  DOWN_LEFT: 3 / 16,
  DOWN: 5 / 16,
  DOWN_RIGHT: 1 / 16,
};

export class ImageProcessor {
  static calculateDimensions(img: HTMLImageElement, pixelSize: number, maxSize = 800) {
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
    width = Math.floor(width / pixelSize) * pixelSize;
    height = Math.floor(height / pixelSize) * pixelSize;
    return { width, height };
  }

  static applyColorFilters(data: Uint8ClampedArray, settings: PixelArtSettings) {
    const { brightness, contrast, saturation } = settings;
    const contrastFactor = contrast;
    const saturationFactor = saturation;
    const NORMALIZATION_FACTOR = 1 / MAX_COLOR_VALUE;

    for (let i = 0; i < data.length; i += RGBA_CHANNELS) {
      if (data[i + Channel.A] === 0) continue;

      let r = data[i + Channel.R];
      let g = data[i + Channel.G];
      let b = data[i + Channel.B];

      r *= brightness;
      g *= brightness;
      b *= brightness;

      r = ((r * NORMALIZATION_FACTOR - 0.5) * contrastFactor + 0.5) * MAX_COLOR_VALUE;
      g = ((g * NORMALIZATION_FACTOR - 0.5) * contrastFactor + 0.5) * MAX_COLOR_VALUE;
      b = ((b * NORMALIZATION_FACTOR - 0.5) * contrastFactor + 0.5) * MAX_COLOR_VALUE;

      const gray = LUMINANCE_COEFF.R * r + LUMINANCE_COEFF.G * g + LUMINANCE_COEFF.B * b;
      r = gray + saturationFactor * (r - gray);
      g = gray + saturationFactor * (g - gray);
      b = gray + saturationFactor * (b - gray);

      data[i + Channel.R] = Math.max(0, Math.min(MAX_COLOR_VALUE, Math.round(r)));
      data[i + Channel.G] = Math.max(0, Math.min(MAX_COLOR_VALUE, Math.round(g)));
      data[i + Channel.B] = Math.max(0, Math.min(MAX_COLOR_VALUE, Math.round(b)));
    }
  }

  static applyDithering(data: Uint8ClampedArray, width: number, height: number, colorStep: number) {
    const errorBuffer = new Float32Array(width * RGB_CHANNELS);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * RGBA_CHANNELS;

        for (let channel = 0; channel < RGB_CHANNELS; channel++) {
          const oldPixel = data[i + channel] + (errorBuffer[x * RGB_CHANNELS + channel] || 0);
          const newPixel = Math.round(oldPixel / colorStep) * colorStep;
          const error = oldPixel - newPixel;

          data[i + channel] = Math.max(0, Math.min(MAX_COLOR_VALUE, newPixel));

          if (x + 1 < width) {
            data[i + RGBA_CHANNELS + channel] += error * DITHER_COEFF.RIGHT;
          }

          if (y + 1 < height) {
            const nextRowIndex = x * RGB_CHANNELS + channel;
            if (x > 0) {
              errorBuffer[(x - 1) * RGB_CHANNELS + channel] =
                (errorBuffer[(x - 1) * RGB_CHANNELS + channel] || 0) +
                error * DITHER_COEFF.DOWN_LEFT;
            }
            errorBuffer[nextRowIndex] =
              (errorBuffer[nextRowIndex] || 0) + error * DITHER_COEFF.DOWN;
            if (x + 1 < width) {
              errorBuffer[(x + 1) * RGB_CHANNELS + channel] =
                (errorBuffer[(x + 1) * RGB_CHANNELS + channel] || 0) +
                error * DITHER_COEFF.DOWN_RIGHT;
            }
          }
        }
      }
      errorBuffer.fill(0);
    }
  }

  static applyPixelization(
    data: Uint8ClampedArray,
    width: number,
    height: number,
    pixelSize: number,
    colorStep: number,
    useDithering: boolean
  ) {
    const blockCache = new Map<string, [number, number, number, number]>();

    for (let y = 0; y < height; y += pixelSize) {
      for (let x = 0; x < width; x += pixelSize) {
        const blockKey = `${x},${y}`;
        let avgColor: [number, number, number, number];

        if (blockCache.has(blockKey)) {
          avgColor = blockCache.get(blockKey)!;
        } else {
          let r = 0,
            g = 0,
            b = 0,
            a = 0,
            count = 0;
          const maxY = Math.min(y + pixelSize, height);
          const maxX = Math.min(x + pixelSize, width);

          for (let py = y; py < maxY; py++) {
            for (let px = x; px < maxX; px++) {
              const i = (py * width + px) * RGBA_CHANNELS;
              if (data[i + Channel.A] > 0) {
                r += data[i + Channel.R];
                g += data[i + Channel.G];
                b += data[i + Channel.B];
                a += data[i + Channel.A];
                count++;
              }
            }
          }

          if (count > 0) {
            r = Math.floor(r / count);
            g = Math.floor(g / count);
            b = Math.floor(b / count);
            a = Math.floor(a / count);
            if (!useDithering) {
              r = Math.floor(r / colorStep) * colorStep;
              g = Math.floor(g / colorStep) * colorStep;
              b = Math.floor(b / colorStep) * colorStep;
            }
          }

          avgColor = [r, g, b, a];
          blockCache.set(blockKey, avgColor);
        }

        if (avgColor[Channel.A] > 0) {
          const maxY = Math.min(y + pixelSize, height);
          const maxX = Math.min(x + pixelSize, width);
          for (let py = y; py < maxY; py++) {
            for (let px = x; px < maxX; px++) {
              const i = (py * width + px) * RGBA_CHANNELS;
              data[i + Channel.R] = avgColor[Channel.R];
              data[i + Channel.G] = avgColor[Channel.G];
              data[i + Channel.B] = avgColor[Channel.B];
              data[i + Channel.A] = avgColor[Channel.A];
            }
          }
        }
      }
    }
  }

  static async processImage(
    canvas: HTMLCanvasElement,
    img: HTMLImageElement,
    settings: PixelArtSettings
  ): Promise<string> {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) throw new Error('2D CONTEXT NOT AVAILABLE');

    const { width, height } = this.calculateDimensions(img, settings.pixelSize);
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    return new Promise<string>((resolve, reject) => {
      requestAnimationFrame(() => {
        try {
          this.applyColorFilters(data, settings);

          const colorStep = Math.floor(COLOR_VALUES_PER_CHANNEL / settings.colorReduction);

          if (settings.dithering) {
            this.applyDithering(data, width, height, colorStep);
          }

          this.applyPixelization(
            data,
            width,
            height,
            settings.pixelSize,
            colorStep,
            settings.dithering
          );

          const newImageData = new ImageData(data, width, height);
          ctx.putImageData(newImageData, 0, 0);

          canvas.toBlob(
            (blob: Blob | null) => {
              if (blob) {
                resolve(URL.createObjectURL(blob));
              } else {
                reject(new Error('ERROR GENERATING PIXEL ART IMAGE'));
              }
            },
            'image/png',
            1.0
          );
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}
