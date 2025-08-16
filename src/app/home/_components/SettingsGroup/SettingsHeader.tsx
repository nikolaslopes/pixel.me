import { FilePlus, RefreshCw, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface SettingsHeaderProps {
  onResetSettings: () => void;
  onAddNewImage: () => void;
}

export const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onResetSettings,
  onAddNewImage,
}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
        <Settings size={20} />
        {t('settings.title')}
      </h3>

      <div className="flex w-full items-center gap-2 md:w-auto">
        <button
          onClick={onResetSettings}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600/60 px-3 py-2 text-sm text-blue-100 transition-all hover:bg-blue-600/90 md:flex-initial"
        >
          <RefreshCw size={14} />
          {t('settings.reset')}
        </button>

        <button
          onClick={onAddNewImage}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600/60 px-3 py-2 text-sm text-blue-100 transition-all hover:bg-blue-600/90 md:flex-initial"
        >
          <FilePlus size={14} />
          {t('settings.newImage')}
        </button>
      </div>
    </div>
  );
};
