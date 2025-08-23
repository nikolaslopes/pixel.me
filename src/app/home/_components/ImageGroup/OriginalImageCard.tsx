import { useTranslation } from 'react-i18next';
import { ImageIcon } from 'lucide-react';

interface OriginalImageCardProps {
  src: string;
}

export const OriginalImageCard: React.FC<OriginalImageCardProps> = ({ src }) => {
  const { t: getText } = useTranslation();

  return (
    <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
        <ImageIcon size={20} />
        {getText('results.originalImage')}
      </h3>
      <div className="rounded-lg bg-white/5 p-4">
        <img src={src} alt="Original" className="h-auto w-full rounded-lg shadow-lg" />
      </div>
    </div>
  );
};
