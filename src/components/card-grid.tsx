import { getDictionary } from '@/lib/dictionaries';
import { CardItem } from './card-item';
import { cn } from '@/lib/utils';
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { CardListing, Dictionary } from '@/lib/definitions';
import { PlaceHolderImages } from '@/lib/placeholder-images';


// This function fetches all card listings from the 'listings' collection in Firestore.
async function getCardListings(): Promise<CardListing[]> {
  try {
    const listingsCol = collection(db, 'listings');
    const listingSnapshot = await getDocs(listingsCol);
    const cardListings = listingSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      
      const imageId = data.imageId || `card${(Math.floor(Math.random() * 9) + 1)}`;
      const image = PlaceHolderImages.find(img => img.id === imageId) || PlaceHolderImages[0];

      return {
        id: doc.id,
        name: data.name || 'Unknown Card',
        edition: data.edition || 'Unknown Set',
        image,
        seller: data.seller || { name: 'Anonymous', reputation: 0, avatarUrl: '' },
        price: data.price || 0,
        condition: data.condition || 'NM',
        isFoil: data.isFoil || false,
        color: data.color || [],
        manaCost: data.manaCost || 0,
        language: data.language || 'English',
      } as CardListing;
    });

    return cardListings;
  } catch (error) {
    console.error("Error fetching card listings from Firestore:", error);
    return []; // Return an empty array on error
  }
}


export async function CardGrid({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const dict = await getDictionary();
  const t = dict.home.cardGrid;
  const cardItemT = dict.home.cardItem;
  
  // Fetch data from Firestore instead of using local data.
  const listings = await getCardListings();

  const query = searchParams?.query as string | undefined;
  const conditions = (searchParams?.condition as string | undefined)?.split(',');
  const languages = (searchParams?.language as string | undefined)?.split(',');
  const colors = (searchParams?.color as string | undefined)?.split(',');
  const maxPrice = searchParams?.price ? Number(searchParams.price) : undefined;

  const filteredListings = listings.filter((listing) => {
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
        <h3 className="text-2xl font-bold tracking-tight font-headline">{t.noCardsFound}</h3>
        <p className="text-muted-foreground">
          {t.adjustFilters}
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
        <CardItem key={listing.id} listing={listing} t={cardItemT} />
      ))}
    </div>
  );
}
