import { getDictionary } from '@/lib/dictionaries';
import { Logo } from './logo';

export default async function Footer({ lang }: { lang: 'es' | 'en' }) {
  const dict = await getDictionary(lang);
  const t = dict.footer;
  return (
    <footer className="py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {t.builtBy.replace('{year}', String(new Date().getFullYear()))}
        </p>
      </div>
    </footer>
  );
}
