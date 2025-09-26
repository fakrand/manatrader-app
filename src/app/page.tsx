import { Suspense } from 'react';
import { CardGrid } from '@/components/card-grid';
import { Filters } from '@/components/filters';
import { Skeleton } from '@/components/ui/skeleton';
import { redirect } from 'next/navigation';

export default function Home() {
  // This page is no longer used, we redirect to the language-specific page.
  redirect('/es');
}
