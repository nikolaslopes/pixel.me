import 'i18next';
import pt from '@/i18n/locales/pt/translation.json';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'pt';
    resources: {
      pt: typeof pt;
    };
  }
}
