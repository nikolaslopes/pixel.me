import React from 'react';
import { useTranslation } from 'react-i18next';
import { Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="py-8">
      <div className="flex items-center justify-center gap-2 text-center text-sm text-blue-200">
        <Github size={16} />
        <p>
          {t('footer.developedBy')}
          <a
            href="https://github.com/nikolaslopes"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white transition-colors hover:text-pink-400 hover:underline"
          >
            {' '}
            @nikolaslopes
          </a>
        </p>
      </div>
    </footer>
  );
};
