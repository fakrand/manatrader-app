
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/i18n-config';
import { HeaderClient } from './header-client';

export default async function Header({ lang }: { lang: Locale }) {
  const dict = await getDictionary(lang);
  
  return (
    <HeaderClient lang={lang} dict={dict} />
  );
}

    

    