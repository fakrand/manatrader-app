import 'server-only'
import type { Dictionary } from './definitions';

// We enumerate all dictionaries here for better linting and typescript support
const dictionaries = {
  es: () => import('@/dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (): Promise<Dictionary> => {
    return dictionaries.es();
}
