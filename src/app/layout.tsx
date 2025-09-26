import './globals.css';
import { Inter, Space_Grotesk, Press_Start_2P } from 'next/font/google';
import { cn } from '@/lib/utils';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Toaster } from '@/components/ui/toaster';
import { getDictionary } from '@/lib/dictionaries';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start-2p',
});


export async function generateMetadata({ params: { lang } }: { params: { lang: 'es' | 'en' } }) {
  const dictionary = await getDictionary(lang);
  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}


export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: 'es' | 'en' };
}>) {
  return (
    <html lang={params.lang} className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          spaceGrotesk.variable,
          pressStart2P.variable
        )}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header lang={params.lang} />
          <main className="flex-1">{children}</main>
          <Footer lang={params.lang} />
        </div>
        <Toaster />
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'es' }];
}
