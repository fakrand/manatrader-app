import { PlaceHolderImages } from './placeholder-images';
import type { CardListing } from './definitions';

const placeholderImages = PlaceHolderImages;

const sampleCards: Omit<CardListing, 'id' | 'seller' | 'price' | 'image'>[] = [
  { name: 'Island', edition: 'Alpha', condition: 'NM', isFoil: false, color: ['U'], manaCost: 0, language: 'English' },
  { name: 'Mountain', edition: 'Beta', condition: 'LP', isFoil: false, color: ['R'], manaCost: 0, language: 'Spanish' },
  { name: 'Plains', edition: 'Unlimited', condition: 'MP', isFoil: true, color: ['W'], manaCost: 0, language: 'Japanese' },
  { name: 'Swamp', edition: 'Revised', condition: 'HP', isFoil: false, color: ['B'], manaCost: 0, language: 'English' },
  { name: 'Forest', edition: '4th Edition', condition: 'NM', isFoil: true, color: ['G'], manaCost: 0, language: 'Spanish' },
  { name: 'Sol Ring', edition: 'Commander 2021', condition: 'NM', isFoil: false, color: [], manaCost: 1, language: 'English' },
  { name: 'Lightning Bolt', edition: 'Modern Horizons 2', condition: 'LP', isFoil: true, color: ['R'], manaCost: 1, language: 'English' },
  { name: 'Counterspell', edition: 'Strixhaven', condition: 'NM', isFoil: false, color: ['U'], manaCost: 2, language: 'Japanese' },
  { name: 'Black Lotus', edition: 'Alpha', condition: 'DMG', isFoil: false, color: [], manaCost: 0, language: 'English' },
  { name: 'Brainstorm', edition: 'Ice Age', condition: 'MP', isFoil: false, color: ['U'], manaCost: 1, language: 'English' },
  { name: 'Wrath of God', edition: '7th Edition', condition: 'NM', isFoil: true, color: ['W'], manaCost: 4, language: 'English' },
  { name: 'Tarmogoyf', edition: 'Future Sight', condition: 'LP', isFoil: false, color: ['G'], manaCost: 2, language: 'Spanish' },
];

const sellers = [
  { name: 'CardKing', reputation: 4.9, avatarUrl: 'https://picsum.photos/seed/seller1/40/40' },
  { name: 'ManaManiac', reputation: 4.8, avatarUrl: 'https://picsum.photos/seed/seller2/40/40' },
  { name: 'TopDeckTreasures', reputation: 5.0, avatarUrl: 'https://picsum.photos/seed/seller3/40/40' },
];

export const cardListings: CardListing[] = Array.from({ length: 12 }).map((_, i) => {
  const cardTemplate = sampleCards[i % sampleCards.length];
  return {
    ...cardTemplate,
    id: `card-${i + 1}`,
    price: Math.floor(Math.random() * 2000) + 1,
    image: placeholderImages[i % 9],
    seller: sellers[i % sellers.length],
  };
});
