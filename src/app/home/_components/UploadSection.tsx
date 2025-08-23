import { ChangeEvent, RefObject, useState, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { ErrorMessage } from './ErrorMessage';

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
  const { t: getText } = useTranslation();
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isValidImageFile = (file: File): boolean => {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/bmp',
      'image/tiff',
    ];
    return validTypes.includes(file.type);
  };

  const handleFiles = (files: FileList) => {
    const file = files[0];

    if (!file) return;

    setErrorMessage(null);

    if (!isValidImageFile(file)) {
      const errorMsg = getText('upload.invalidFiles', {
        file: file.name,
      });

      setErrorMessage(errorMsg);
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    const mockEvent = {
      target: {
        files: {
          0: file,
          length: 1,
          item: (index: number) => (index === 0 ? file : null),
          [Symbol.iterator]: function* () {
            yield file;
          },
        },
      },
    } as unknown as ChangeEvent<HTMLInputElement>;

    onImageUpload(mockEvent);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
      {errorMessage && <ErrorMessage message={errorMessage} />}

      <div
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'scale-105 border-pink-400 bg-pink-400/10'
            : 'border-blue-300 hover:border-pink-400'
        }`}
        onClick={onUploadClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Upload
          className={`mx-auto mb-4 transition-colors duration-200 ${
            isDragOver ? 'text-pink-400' : 'text-blue-300'
          }`}
          size={48}
        />
        <p className="mb-2 text-lg text-white">
          {isDragOver ? getText('upload.drop') : getText('upload.title')}
        </p>
        <p className="text-sm text-blue-200">
          {isDragOver ? getText('upload.dropDescription') : getText('upload.description')}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/bmp,image/tiff"
          onChange={onImageUpload}
          className="hidden"
          multiple={false}
        />
      </div>
    </div>
  );
};
