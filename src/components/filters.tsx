"use client";

import { useState, useTransition, useCallback } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { useDebounceCallback } from 'usehooks-ts'

import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from './ui/button';
import { ManaSymbol } from './mana-symbol';
import { cn } from '@/lib/utils';
import { fetchSmartFilters } from '@/app/actions';
import { getDictionary } from '@/lib/dictionaries';
import { Locale } from '@/i18n-config';

const conditions = ['NM', 'LP', 'MP', 'HP', 'DMG'];
const languages = ['English', 'Spanish', 'Japanese'];
const colors: ('W' | 'U' | 'B' | 'R' | 'G')[] = ['W', 'U', 'B', 'R', 'G'];

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['home']['filters'];

export function Filters({ lang, dict }: { lang: Locale, dict: Dictionary }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [suggestedFilters, setSuggestedFilters] = useState<string[]>([]);

  const t = dict;

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }
      return newSearchParams.toString();
    },
    [searchParams]
  );
  
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ query: e.target.value })}`, { scroll: false });
    });
    debouncedSmartFilter(e.target.value);
  };
  
  const debouncedSmartFilter = useDebounceCallback(async (query: string) => {
    const suggestions = await fetchSmartFilters(query);
    setSuggestedFilters(suggestions);
  }, 500);

  const handleSliderChange = (newPrice: number[]) => {
    startTransition(() => {
      router.push(`${pathname}?${createQueryString({ price: newPrice[0] })}`, { scroll: false });
    });
  };

  const handleCheckboxChange = (group: string, value: string, checked: boolean) => {
      const currentValues = searchParams.get(group)?.split(',') || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      startTransition(() => {
        router.push(
          `${pathname}?${createQueryString({ [group]: newValues.length > 0 ? newValues.join(',') : null })}`,
          { scroll: false }
        );
      });
  };

  const selectedPrice = searchParams.get('price') ? [Number(searchParams.get('price'))] : [2000];
  
  const getFilterClass = (filterName: string) => {
    return cn("w-full", {
      "ring-2 ring-primary rounded-md transition-all duration-300": suggestedFilters.includes(filterName),
    });
  };
  
  const defaultAccordionValues = Array.from(searchParams.keys());

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.searchPlaceholder}
          className="pl-9"
          value={searchParams.get('query') ?? ''}
          onChange={handleQueryChange}
        />
      </div>

      <Accordion type="multiple" defaultValue={defaultAccordionValues} className="w-full">
        <AccordionItem value="condition" className={getFilterClass('Condition')}>
          <AccordionTrigger>{t.condition}</AccordionTrigger>
          <AccordionContent>
            {conditions.map((condition) => (
              <div key={condition} className="flex items-center space-x-2 py-1">
                <Checkbox id={`cond-${condition}`} onCheckedChange={(checked) => handleCheckboxChange('condition', condition, !!checked)} checked={searchParams.get('condition')?.includes(condition)} />
                <Label htmlFor={`cond-${condition}`} className="font-normal">{condition}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="language" className={getFilterClass('Language')}>
          <AccordionTrigger>{t.language}</AccordionTrigger>
          <AccordionContent>
            {languages.map((lang) => (
              <div key={lang} className="flex items-center space-x-2 py-1">
                <Checkbox id={`lang-${lang}`} onCheckedChange={(checked) => handleCheckboxChange('language', lang, !!checked)} checked={searchParams.get('language')?.includes(lang)} />
                <Label htmlFor={`lang-${lang}`} className="font-normal">{lang}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price" className={getFilterClass('Price')}>
          <AccordionTrigger>{t.price}</AccordionTrigger>
          <AccordionContent>
            <div className="p-2 space-y-4">
              <Slider
                defaultValue={selectedPrice}
                max={2000}
                step={5}
                onValueCommit={handleSliderChange}
              />
              <div className="flex justify-between text-sm">
                <span>S/ 0</span>
                <span>S/ {selectedPrice[0]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

         <AccordionItem value="color" className={getFilterClass('Color')}>
          <AccordionTrigger>{t.color}</AccordionTrigger>
          <AccordionContent>
            <div className="flex justify-around p-2">
              {colors.map((color) => {
                const isSelected = searchParams.get('color')?.includes(color);
                return (
                  <Button 
                    key={color}
                    variant="ghost"
                    size="icon"
                    className={cn('rounded-full', {'bg-primary/20 ring-2 ring-primary': isSelected})}
                    onClick={() => handleCheckboxChange('color', color, !isSelected)}
                  >
                    <ManaSymbol color={color} className="h-6 w-6" />
                  </Button>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

         <AccordionItem value="cost" className={getFilterClass('Cost of Mana')}>
          <AccordionTrigger>{t.manaCost}</AccordionTrigger>
          <AccordionContent>
             <div className="p-2 space-y-4">
               <Slider
                defaultValue={[10]}
                max={16}
                step={1}
              />
              <div className="flex justify-between text-sm">
                <span>0</span>
                <span>16</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
