
import type { Locale } from '@/i18n-config';
import type { Dictionary } from './definitions';

// Map de loaders, tipado estrictamente con los locales soportados
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('@/dictionaries/en.json').then((module) => module.default),
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  // Fallback a 'es' si el locale no está soportado
  const loader = dictionaries[locale] ?? dictionaries.es;
  return loader();
};
