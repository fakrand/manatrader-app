import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/i18n-config';
import { ArrowRight, ShoppingCart, Repeat, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

async function getRandomCard() {
  const response = await fetch('https://api.scryfall.com/cards/random?q=set%3Aleb');
  const card = await response.json();
  return {
    imageUrl: card.image_uris?.large || "https://cards.scryfall.io/large/front/f/c/fce0d45c-7a4c-4088-a6d2-f447859cc8d2.jpg",
    name: card.name || "Blacker Lotus",
  };
}

export default async function LandingPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dict = await getDictionary(lang);
  const t = dict.landing;

  const [card1, card2, card3] = await Promise.all([
    getRandomCard(),
    getRandomCard(),
    getRandomCard(),
  ]);

  const cards = [card1, card2, card3];

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/10 to-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl xl:text-6xl/none">
                    {t.hero.title}
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    {t.hero.subtitle}
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href={`/${lang}/browse`}>
                      {t.hero.ctaBrowse}
                      <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg">
                     <Link href={`/${lang}/create-listing`}>
                      {t.hero.ctaSell}
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center h-[350px] lg:h-[420px]">
                {cards.map((card, index) => {
                  const rotations = ['-rotate-6', 'rotate-2', 'rotate-8'];
                  const zIndexes = ['z-0', 'z-10', 'z-20'];
                  const margins = ['-ml-16', 'ml-0', 'ml-16'];

                  return (
                     <div 
                      key={card.name + index}
                      className={cn(
                        "absolute w-[200px] h-[280px] lg:w-[240px] lg:h-[336px] bg-transparent rounded-lg shadow-2xl transition-transform duration-500 hover:scale-110 flex items-center justify-center",
                        rotations[index],
                        zIndexes[index],
                        margins[index]
                      )}
                      style={{ transformOrigin: 'bottom center' }}
                    >
                        <Image
                          src={card.imageUrl}
                          alt={card.name}
                          width={240}
                          height={336}
                          className="rounded-xl shadow-lg"
                          data-ai-hint="magic card"
                        />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">{t.features.supertitle}</div>
                <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-5xl">{t.features.title}</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  {t.features.subtitle}
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border/20">
                <ShoppingCart className="h-12 w-12 text-primary" />
                <h3 className="mt-4 text-2xl font-bold font-headline">{t.features.buy.title}</h3>
                <p className="mt-2 text-muted-foreground">{t.features.buy.description}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border/20">
                <PlusCircle className="h-12 w-12 text-primary" />
                <h3 className="mt-4 text-2xl font-bold font-headline">{t.features.sell.title}</h3>
                <p className="mt-2 text-muted-foreground">{t.features.sell.description}</p>
              </div>
               <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-md border border-border/20">
                <Repeat className="h-12 w-12 text-primary" />
                <h3 className="mt-4 text-2xl font-bold font-headline">{t.features.trade.title}</h3>
                <p className="mt-2 text-muted-foreground">{t.features.trade.description}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
