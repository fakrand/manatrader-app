import 'server-only'
import type { Locale } from '../i18n-config'
import type { Dictionary } from './definitions';

// We enumerate all dictionaries here for better linting and typescript support
const dictionaries = {
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
    const loader = dictionaries[locale] || dictionaries.es;
    return loader();
}
