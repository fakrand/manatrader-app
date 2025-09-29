import { getDictionary } from '@/lib/dictionaries';
import { HeaderClient } from './header-client';
import { Locale } from '@/i18n-config';

export default async function Header({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  
  return (
    <HeaderClient dict={dict} lang={lang} />
  );
}
