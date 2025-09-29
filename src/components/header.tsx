
import { getDictionary } from '@/lib/dictionaries';
import { HeaderClient } from './header-client';

export default async function Header() {
  const dict = await getDictionary();
  
  return (
    <HeaderClient dict={dict} />
  );
}
