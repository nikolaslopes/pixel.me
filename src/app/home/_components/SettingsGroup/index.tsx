import React from 'react';

import { SettingsHeader, SettingsHeaderProps } from './SettingsHeader';
import { SettingsAction, SettingsActionsProps } from './SettingsActions';

type SettingsGroupProps = SettingsHeaderProps & SettingsActionsProps;

export const SettingsGroup: React.FC<SettingsGroupProps> = ({
  onResetSettings,
  onAddNewImage,
  settings,
  activePreset,
  onSettingsChange,
  onPresetChange,
}) => {
  return (
    <div className="mb-6 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg">
      <SettingsHeader onResetSettings={onResetSettings} onAddNewImage={onAddNewImage} />
      <SettingsAction
        settings={settings}
        activePreset={activePreset}
        onSettingsChange={onSettingsChange}
        onPresetChange={onPresetChange}
      />
    </div>
  );
};
