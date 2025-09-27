import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { CardListing } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

// This function fetches all card listings from the 'listings' collection in Firestore.
export async function getCardListings(): Promise<CardListing[]> {
  try {
    const listingsCol = collection(db, 'listings');
    const listingSnapshot = await getDocs(listingsCol);
    const cardListings = listingSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => {
      const data = doc.data();
      
      // Find a placeholder image. In a real app, the image would come from the database.
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
