
import Image from 'next/image';
import { Star, ShoppingCart } from 'lucide-react';

import type { CardListing, Dictionary } from '@/lib/definitions';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface CardItemProps {
  listing: CardListing;
  t: Dictionary['home']['cardItem'];
}

export function CardItem({ listing, t }: CardItemProps) {
  return (
    <div className="group relative">
      <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-card shadow-lg group-hover:shadow-primary/50 transition-shadow">
        <Image
          src={listing.image.imageUrl}
          alt={listing.name}
          width={300}
          height={420}
          data-ai-hint={listing.image.imageHint}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
         {listing.isFoil && (
          <Badge variant="outline" className="absolute top-2 right-2 bg-background/70 backdrop-blur text-yellow-300 border-yellow-400">
            {t.foil}
          </Badge>
        )}
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm font-headline text-foreground/90">
            <a href="#">
              <span aria-hidden="true" className="absolute inset-0" />
              {listing.name}
            </a>
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {listing.edition}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">S/ {listing.price.toFixed(2)}</p>
          <Badge variant="secondary" className="mt-1">{listing.condition}</Badge>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 cursor-pointer">
                <Image src={listing.seller.avatarUrl} alt={listing.seller.name} width={20} height={20} className="rounded-full" />
                <span>{listing.seller.name}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <p>{t.reputation.replace('{reputation}', listing.seller.reputation.toFixed(1))}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
       <div className="absolute bottom-24 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button size="icon" variant="default" className='bg-accent hover:bg-accent/80 text-accent-foreground'>
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">{t.addToCart}</span>
        </Button>
      </div>
    </div>
  );
}
