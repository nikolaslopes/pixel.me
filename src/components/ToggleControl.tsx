import { HelpCircle } from 'lucide-react';
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
  return (
    <div>
      <Tooltip.Root>
        <div className="mb-3 flex items-center gap-2">
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

      <div className="flex items-center justify-between">
        <button
          onClick={() => onChange(!value)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-pink-400 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none ${
            value ? 'bg-pink-500' : 'bg-gray-600'
          }`}
          role="switch"
          aria-checked={value}
          aria-label={`${value ? 'Desativar' : 'Ativar'} ${label}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
