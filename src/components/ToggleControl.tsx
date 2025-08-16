import { HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as Tooltip from '@radix-ui/react-tooltip';

interface ToggleControlProps {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export const ToggleControl: React.FC<ToggleControlProps> = ({
  label,
  description,
  value,
  onChange,
}) => {
  const { t } = useTranslation();

  return (
    <div>
      <Tooltip.Root>
        <div className="mb-2 flex items-center gap-2">
          <label className="text-sm text-blue-200">{label}</label>
          <Tooltip.Trigger asChild>
            <button type="button" aria-label={`Ajuda sobre ${label}`}>
              <HelpCircle className="size-4 text-blue-400 opacity-50 transition-opacity hover:opacity-75" />
            </button>
          </Tooltip.Trigger>
        </div>

        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 max-w-xs rounded-md bg-gray-800 px-3 py-2 text-sm text-white shadow-lg"
            sideOffset={5}
          >
            {description}
            <Tooltip.Arrow className="fill-gray-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <button
        onClick={() => onChange(!value)}
        className={`w-full rounded-lg px-4 py-2 transition-all ${
          value ? 'bg-pink-500 text-white' : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
        }`}
      >
        {value ? t('settings.ditheringOn') : t('settings.ditheringOff')}
      </button>
    </div>
  );
};
