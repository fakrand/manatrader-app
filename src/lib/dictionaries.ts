
import type { Dictionary } from './definitions';

// Directly import the Spanish dictionary.
import es from '@/dictionaries/es.json';

// The function now simply returns the imported dictionary.
export const getDictionary = async (): Promise<Dictionary> => {
  return es;
};
