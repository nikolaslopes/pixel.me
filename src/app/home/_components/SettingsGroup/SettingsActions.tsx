import * as Tooltip from '@radix-ui/react-tooltip';
import { useTranslation } from 'react-i18next';

import { SettingsControl } from '@/components/SettingsControl';
import { ToggleControl } from '@/components/ToggleControl';
import { PixelArtSettings, ImagePresetName } from '@/app/home/_lib/types';
import { IMAGE_PRESETS } from '@/app/home/_lib/constants';

export interface SettingsActionsProps {
  settings: PixelArtSettings;
  activePreset: ImagePresetName | null;
  onSettingsChange: (key: keyof PixelArtSettings, value: number | boolean) => void;
  onPresetChange: (name: ImagePresetName) => void;
}

export const SettingsAction: React.FC<SettingsActionsProps> = ({
  settings,
  activePreset,
  onSettingsChange,
  onPresetChange,
}) => {
  const { t } = useTranslation();

  return (
    <Tooltip.Provider delayDuration={300}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <SettingsControl
          label={t('settings.pixelSize')}
          description={t('settings.tooltips.pixelSize')}
          value={settings.pixelSize}
          min="2"
          max="20"
          unit="px"
          onChange={(value) => onSettingsChange('pixelSize', value)}
        />

        <SettingsControl
          label={t('settings.colorReduction')}
          description={t('settings.tooltips.colorReduction')}
          value={settings.colorReduction}
          min="4"
          max="64"
          unit=" cores"
          onChange={(value) => onSettingsChange('colorReduction', value)}
        />

        <SettingsControl
          label={t('settings.brightness')}
          description={t('settings.tooltips.brightness')}
          value={settings.brightness}
          min="0.3"
          max="2"
          step="0.1"
          unit="x"
          onChange={(value) => onSettingsChange('brightness', value)}
        />

        <SettingsControl
          label={t('settings.contrast')}
          description={t('settings.tooltips.contrast')}
          value={settings.contrast}
          min="0.3"
          max="2"
          step="0.1"
          unit="x"
          onChange={(value) => onSettingsChange('contrast', value)}
        />

        <SettingsControl
          label={t('settings.saturation')}
          description={t('settings.tooltips.saturation')}
          value={settings.saturation}
          min="0"
          max="2"
          step="0.1"
          unit="x"
          onChange={(value) => onSettingsChange('saturation', value)}
        />

        <ToggleControl
          label={t('settings.dithering')}
          description={t('settings.tooltips.dithering')}
          value={settings.dithering}
          onChange={(value) => onSettingsChange('dithering', value)}
        />

        <div className="mb-4 flex flex-col gap-2">
          <label className="mb-2 block text-sm text-blue-200">{t('settings.presets')}</label>
          <div className="flex flex-wrap gap-2 md:flex-nowrap">
            {(Object.keys(IMAGE_PRESETS) as ImagePresetName[]).map((name) => (
              <button
                key={name}
                onClick={() => onPresetChange(name)}
                className={`rounded-lg px-3 py-1.5 text-sm backdrop-blur transition ${
                  activePreset === name
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'border border-white/20 bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};
