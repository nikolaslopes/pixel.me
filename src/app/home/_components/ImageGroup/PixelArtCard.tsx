import React from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Download } from 'lucide-react';

interface PixelArtCardProps {
  src: string | null;
  loading: boolean;
  onDownload: () => void;
}

export const PixelArtCard: React.FC<PixelArtCardProps> = ({ src, loading, onDownload }) => {
  const { t } = useTranslation();

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Palette size={20} />
          {t('results.pixelArt')}
        </h3>
        {src && !loading && (
          <button
            onClick={onDownload}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-2 text-white transition-all hover:from-pink-600 hover:to-purple-700"
          >
            <Download size={16} />
            {t('results.download')}
          </button>
        )}
      </div>

      <div className="relative flex min-h-[200px] items-center justify-center rounded-lg bg-white/5 p-4">
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-black/50">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-pink-400"></div>
            <p className="mt-4 ml-4 text-white">{t('results.processing')}</p>
          </div>
        )}
        {src && (
          <img
            src={src}
            alt="Pixel Art"
            className={`h-auto w-full rounded-lg shadow-lg transition-opacity duration-300 ${
              loading ? 'opacity-30 blur-sm' : 'blur-0 opacity-100'
            }`}
            style={{ imageRendering: 'pixelated' }}
          />
        )}
      </div>
    </div>
  );
};
