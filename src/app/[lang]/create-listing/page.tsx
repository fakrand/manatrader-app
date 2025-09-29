import { Suspense } from 'react';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/i18n-config';
import { CreateListingForm } from './create-listing-form';

// This is now a pure Server Component to fetch the dictionary
export default async function CreateListingPage({ params: { lang } }: { params: { lang: Locale } }) {
    const dict = await getDictionary(lang);
    const t = dict.createListing;
    
    // We wrap the client component in Suspense for better loading experience
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold font-headline mb-2">{t.title}</h1>
        <p className="text-muted-foreground mb-6">{t.description}</p>
        <Suspense fallback={<div>Loading...</div>}>
            <CreateListingForm t={t} lang={lang} />
        </Suspense>
      </div>
    );
}
