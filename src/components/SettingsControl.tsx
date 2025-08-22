import { ChangeEvent } from 'react';
import { HelpCircle } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface SettingsControlProps {
  label: string;
  description: string;
  value: number;
  min: string;
  max: string;
  step?: string;
  unit: string;
  onChange: (value: number) => void;
}

export const SettingsControl: React.FC<SettingsControlProps> = ({
  label,
  description,
  value,
  min,
  max,
  step = '1',
  unit,
  onChange,
}) => (
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
          className="max-w-xs rounded-md bg-gray-800 px-3 py-2 text-sm text-white shadow-lg"
          sideOffset={5}
        >
          {description}
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>

    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value))}
      className="w-full accent-pink-500"
    />
    <span className="text-sm text-white">
      {value}
      {unit}
    </span>
  </div>
);
