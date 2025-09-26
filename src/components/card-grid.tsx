import { cardListings } from '@/lib/data';
import { CardItem } from './card-item';
import { cn } from '@/lib/utils';

export async function CardGrid({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 500));

  const query = searchParams?.query as string | undefined;
  const conditions = (searchParams?.condition as string | undefined)?.split(',');
  const languages = (searchParams?.language as string | undefined)?.split(',');
  const colors = (searchParams?.color as string | undefined)?.split(',');
  const maxPrice = searchParams?.price ? Number(searchParams.price) : undefined;

  const filteredListings = cardListings.filter((listing) => {
    if (query && !listing.name.toLowerCase().includes(query.toLowerCase())) {
      return false;
    }
    if (conditions && !conditions.includes(listing.condition)) {
      return false;
    }
    if (languages && !languages.includes(listing.language)) {
      return false;
    }
    if (maxPrice && listing.price > maxPrice) {
      return false;
    }
    if (colors && colors.length > 0 && !colors.some(c => listing.color.includes(c as any))) {
        return false;
    }
    return true;
  });

  if (filteredListings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center h-[50vh]">
        <h3 className="text-2xl font-bold tracking-tight font-headline">No cards found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search or filters.
        </p>
      </div>
    )
  }

  return (
    <div className={cn(
      "grid grid-cols-1 gap-x-6 gap-y-10",
      "sm:grid-cols-2",
      "lg:grid-cols-2", // Adjusted for better viewing in a 3-col layout
      "xl:grid-cols-3"
    )}>
      {filteredListings.map((listing) => (
        <CardItem key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
