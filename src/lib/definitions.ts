import type { ImagePlaceholder } from './placeholder-images';

export type CardListing = {
  id: string;
  name: string;
  edition: string;
  image?: ImagePlaceholder;
  seller?: {
    name: string;
    reputation: number;
    avatarUrl: string;
  };
  price: number;
  condition: 'NM' | 'LP' | 'MP' | 'HP' | 'DMG';
  isFoil: boolean;
  color: ('W' | 'U' | 'B' | 'R' | 'G')[];
  manaCost: number;
  language: 'English' | 'Spanish' | 'Japanese';
};

export type User = {
  name: string;
  avatarUrl: string;
  subscriptionTier: 'Common' | 'Uncommon' | 'Rare' | 'Mythic';
  listingsUsed: number;
  listingLimit: number;
};
