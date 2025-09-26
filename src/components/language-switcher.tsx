
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

export function LanguageSwitcher({ lang }: { lang: 'es' | 'en' }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLang: 'es' | 'en') => {
    // This will replace the current lang segment in the URL
    const newPath = pathname.replace(`/${lang}`, `/${newLang}`);
    router.replace(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange('es')} disabled={lang === 'es'}>
          Español
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange('en')} disabled={lang === 'en'}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
