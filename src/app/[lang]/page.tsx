import { Suspense } from 'react';
import { CardGrid } from '@/components/card-grid';
import { Filters } from '@/components/filters';
import { Skeleton } from '@/components/ui/skeleton';
import { getDictionary } from '@/lib/dictionaries';

export default async function LangHome({
  params: { lang },
  searchParams,
}: {
  params: { lang: 'es' | 'en' };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const dict = await getDictionary(lang);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="sticky top-20">
            <Suspense fallback={<FiltersSkeleton />}>
              <Filters lang={lang} dict={dict.home.filters} />
            </Suspense>
          </div>
        </aside>
        <div className="lg:col-span-3">
          <Suspense fallback={<CardGridSkeleton />}>
            <CardGrid lang={lang} searchParams={searchParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

function FiltersSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-full" />
      <div className="space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[3/4] w-full" />
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="h-5 w-1/2" />
        </div>
      ))}
    </div>
  );
}
