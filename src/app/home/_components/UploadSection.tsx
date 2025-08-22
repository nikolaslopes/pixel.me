import { ChangeEvent, RefObject } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface UploadSectionProps {
  fileInputRef: RefObject<HTMLInputElement | null>;
  onUploadClick: () => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  fileInputRef,
  onUploadClick,
  onImageUpload,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-blue-300 p-8 text-center transition-colors hover:border-pink-400"
        onClick={onUploadClick}
      >
        <Upload className="mx-auto mb-4 text-blue-300" size={48} />
        <p className="mb-2 text-lg text-white">{t('upload.title')}</p>
        <p className="text-sm text-blue-200">{t('upload.description')}</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,image/tiff"
          onChange={onImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
