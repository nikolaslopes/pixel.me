import { Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { LanguageSwitcher } from './LanguageSwitcher';

export const Header: React.FC = () => {
  const { t: getText } = useTranslation();

  return (
    <header className="mb-8 flex justify-between">
      <div className="hidden md:block"></div>
      <div className="flex flex-col">
        <h1 className="font-pixelify mb-2 flex items-center gap-3 text-3xl text-white md:justify-center md:text-5xl">
          <Palette className="size-8 text-pink-400 md:size-12" />
          {getText('header.title')}
        </h1>
        <p className="text-md text-sm text-blue-200 md:text-lg">
          {getText('header.subtitle')} {':))'}
        </p>
      </div>

      <div>{/* <LanguageSwitcher /> */}</div>
    </header>
  );
};
