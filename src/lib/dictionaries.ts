import 'server-only';
import type { Locale } from '@/i18n-config';

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default export for cleaner types
const dictionaries = {
  en: () => import('@/dictionaries/en.json').then(module => module.default),
  es: () => import('@/dictionaries/es.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale) => {
  // Fallback to 'es' if the locale is not supported
  return dictionaries[locale] ? dictionaries[locale]() : dictionaries.es();
};
