import Link from 'next/link';
import {
  CircleUserRound,
  Library,
  PlusCircle,
  Settings,
  ShoppingCart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from './logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getDictionary } from '@/lib/dictionaries';
import { LanguageSwitcher } from './language-switcher';
import { Locale } from '@/i18n-config';

export default async function Header({ lang }: { lang: Locale }) {
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user_avatar_1');
  const dict = await getDictionary(lang);
  const t = dict.header;
  const isLoggedIn = true; // Placeholder for user auth status

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <Logo />
            <span className="hidden font-bold sm:inline-block font-headline text-lg">
              ManaTrader
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href={`/${lang}/browse`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t.browse}
            </Link>
            <Link
              href={`/${lang}/create-listing`}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t.sell}
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Mobile Nav could go here */}
          </div>
          <nav className="flex items-center">
            <LanguageSwitcher lang={lang} />
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/${lang}/cart`}>
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">{t.shoppingCart}</span>
              </Link>
            </Button>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      {userAvatar && <AvatarImage src={userAvatar.imageUrl} alt="User avatar" />}
                      <AvatarFallback>
                        <CircleUserRound />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">PlayerOne</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        player.one@email.com
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href={`/${lang}/profile`}>
                        <CircleUserRound className="mr-2 h-4 w-4" />
                        <span>{t.profile}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Library className="mr-2 h-4 w-4" />
                      <span>{t.myCollection}</span>
                    </DropdownMenuItem>
                     <DropdownMenuItem asChild>
                      <Link href={`/${lang}/create-listing`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>{t.newListing}</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t.settings}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <span>{t.logout}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
               <Button variant="secondary">{t.login}</Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
