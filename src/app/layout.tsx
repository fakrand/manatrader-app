import './globals.css';
import { Inter, Space_Grotesk, Press_Start_2P } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { getDictionary } from '@/lib/dictionaries';
import { i18n, Locale } from '@/i18n-config';
import { AuthProvider } from '@/hooks/use-auth';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' });
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-press-start-2p',
});

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale } }) {
  // This function is now in [lang]/layout.tsx, but we'll keep a fallback here.
  const dictionary = await getDictionary(lang || i18n.defaultLocale);
  return {
    title: dictionary.metadata.title,
    description: dictionary.metadata.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The lang property will be inherited from the [lang]/layout.tsx
    <html className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          spaceGrotesk.variable,
          pressStart2P.variable
        )}
      >
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}
