
import type { ImagePlaceholder } from './placeholder-images';

// We define the structure of the dictionary statically.
// This avoids any server-only imports on the client side for type definitions.
export type Dictionary = {
  header: {
    browse: string;
    sell: string;
    login: string;
    shoppingCart: string;
    profile: string;
    myCollection: string;
    newListing: string;
    settings: string;
    logout: string;
  };
  footer: {
    builtBy: string;
  };
  landing: {
    hero: {
      title: string;
      subtitle: string;
      ctaBrowse: string;
      ctaSell: string;
      cardDescription: string;
    };
    features: {
      supertitle: string;
      title: string;
      subtitle: string;
      buy: {
        title: string;
        description: string;
      };
      sell: {
        title: string;
        description: string;
      };
      trade: {
        title: string;
        description: string;
      };
    };
  };
  home: {
    filters: {
      searchPlaceholder: string;
      condition: string;
      language: string;
      price: string;
      color: string;
      edition: string;
      manaCost: string;
    };
    cardGrid: {
      noCardsFound: string;
      adjustFilters: string;
    };
    cardItem: {
      foil: string;
      addToCart: string;
      reputation: string;
    };
  };
  cart: {
    emptyTitle: string;
    emptyDescription: string;
    browseCards: string;
    title: string;
    orderFrom: string;
    checkoutSummary: string;
    subtotal: string;
    shipping: string;
    shippingCalculated: string;
    total: string;
    proceedToCheckout: string;
  };
  createListing: {
    title: string;
    description: string;
    step1Title: string;
    step1Description: string;
    step1SearchLabel: string;
    step1SearchPlaceholder: string;
    editionLabel: string;
    selectEdition: string;
    step2Title: string;
    step2Description: string;
    step2DescriptionSelected: string;
    priceLabel: string;
    pricePlaceholder: string;
    marketPrice: string;
    quantityLabel: string;
    conditionLabel: string;
    selectCondition: string;
    conditions: {
      NM: string;
      LP: string;
      MP: string;
      HP: string;
      DMG: string;
    };
    languageLabel: string;
    selectLanguage: string;
    languages: {
      [key: string]: string;
      en: string;
      es: string;
      fr: string;
      de: string;
      it: string;
      pt: string;
      jp: string;
      ko: string;
      ru: string;
      zhs: string;
      zht: string;
      he: string;
      la: string;
      grc: string;
      ar: string;
      sa: string;
      px: string;
    };
    foilLabel: string;
    selectFoil: string;
    foils: {
      none: string;
      foil: string;
      etched: string;
      galaxy: string;
    };
    imagesLabel: string;
    frontImage: string;
    backImage: string;
    commentsLabel: string;
    commentsPlaceholder: string;
    publishListing: string;
    listingLimitReached: string;
  };
  profile: {
    editProfile: string;
    listingsUsed: string;
    averageRating: string;
    tierTooltip: string;
    myListings: string;
    myListingsDescription: string;
    noActiveListings: string;
    reputationAndReviews: string;
    reviewsDescription: string;
    noReviews: string;
  };
  auth: {
    title: string;
    description: string;
    emailTab: string;
    phoneTab: string;
    emailLabel: string;
    passwordLabel: string;
    login: string;
    signup: string;
    orContinueWith: string;
    google: string;
    phoneLabel: string;
    sendCode: string;
    codeLabel: string;
    verifyCode: string;
    error: string;
    errors: {
      'auth/invalid-credential': string;
      'auth/email-already-in-use': string;
      'auth/weak-password': string;
      'auth/invalid-email': string;
      'auth/default': string;
    }
  };
  metadata: {
    title: string;
    description: string;
  };
};

export type CardListing = {
  id: string;
  name: string;
  edition: string;
  image: ImagePlaceholder;
  seller: {
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
