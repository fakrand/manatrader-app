
"use client";

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Image as ImageIcon, Loader2 } from "lucide-react";
import { Locale } from "@/i18n-config";
import { cn } from '@/lib/utils';
import { Dictionary } from '@/lib/definitions';
import { useDebounceValue } from 'usehooks-ts';

type ScryfallCard = {
  id: string;
  name: string;
  set: string;
  set_name: string;
  digital: boolean;
  lang: string;
  released_at: string;
  image_uris?: { large: string };
  prices: { usd: string | null; usd_foil: string | null; usd_etched: string | null; };
  finishes: string[];
  border_color: string;
  frame_effects?: string[];
  frame: string;
  promo_types?: string[];
  full_art: boolean;
};

function getVariantInfo(card: ScryfallCard) {
  const parts = new Set<string>();
  if (card.frame_effects?.includes('showcase')) parts.add('Showcase');
  if (card.border_color === 'borderless') parts.add('Borderless');
  if (card.frame_effects?.includes('extendedart')) parts.add('Extended Art');
  if (card.frame === '1997' || card.promo_types?.includes('retroframe')) parts.add('Retro Frame');
  if (card.full_art) parts.add('Full Art');
  const partsArray = Array.from(parts);
  return partsArray.length > 0 ? `(${partsArray.join(', ')})` : '';
}

export function CreateListingForm({ t, lang }: { t: Dictionary['createListing'], lang: Locale }) {
  const listingLimitReached = false;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounceValue(searchQuery, 300);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const [selectedCardName, setSelectedCardName] = useState<string | null>(null);
  const [allCardPrints, setAllCardPrints] = useState<ScryfallCard[]>([]);
  const [isFetchingEditions, setIsFetchingEditions] = useState(false);
  const [selectedEditionId, setSelectedEditionId] = useState<string>('');
  const [selectedCardImage, setSelectedCardImage] = useState<string>('/card-back.png');
  const [marketPrice, setMarketPrice] = useState<string | null>(null);

  const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [availableFinishes, setAvailableFinishes] = useState<string[]>([]);
  const [selectedFinish, setSelectedFinish] = useState('');

  const suggestionsRef = useRef<HTMLUListElement>(null);

  /* ---------- Autocomplete ---------- */
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearchQuery.length < 3 || debouncedSearchQuery === selectedCardName) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(`https://api.scryfall.com/cards/autocomplete?q=${encodeURIComponent(debouncedSearchQuery)}`);
        if (!response.ok) throw new Error('Failed to fetch autocomplete suggestions');
        const data = await response.json();
        setSuggestions(data.data || []);
      } catch (error) {
        console.error(error);
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [debouncedSearchQuery, selectedCardName]);

  const uniqueEditions = useMemo(() => {
    if (allCardPrints.length === 0) return [];
    const editions = allCardPrints.reduce((acc: ScryfallCard[], print) => {
      if (!acc.find(p => p.set === print.set)) {
        const englishVersion = allCardPrints.find(p => p.set === print.set && p.lang === 'en');
        acc.push(englishVersion || print);
      }
      return acc;
    }, []);
    return editions.sort((a, b) => new Date(b.released_at).getTime() - new Date(a.released_at).getTime());
  }, [allCardPrints]);

  /* ---------- Actualizar imagen/precio/idiomas/finishes cuando cambia la edición ---------- */
  useEffect(() => {
    if (!selectedEditionId || allCardPrints.length === 0) return;

    const selectedPrint = allCardPrints.find(e => e.id === selectedEditionId);
    if (selectedPrint) {
      // Imagen y precio
      if (selectedPrint.image_uris) setSelectedCardImage(selectedPrint.image_uris.large);
      const price = selectedPrint.prices?.usd || selectedPrint.prices?.usd_foil || selectedPrint.prices?.usd_etched;
      setMarketPrice(price || null);

      // Idiomas para el set de la edición seleccionada
      const printsInSameSet = allCardPrints.filter(card => card.set === selectedPrint.set);
      const editionLanguages = Array.from(new Set(printsInSameSet.map(card => card.lang)));
      setAvailableLanguages(editionLanguages);

      if (editionLanguages.length > 0 && !editionLanguages.includes(selectedLanguage)) {
        const defaultLang = editionLanguages.includes('en') ? 'en' : (editionLanguages.includes(lang) ? lang : editionLanguages[0]);
        setSelectedLanguage(defaultLang);
      }

      // Finishes (solo los de esta impresión específica)
      if (selectedPrint.finishes && selectedPrint.finishes.length > 0) {
          setAvailableFinishes(selectedPrint.finishes);
          setSelectedFinish(
            selectedPrint.finishes.includes('nonfoil') ? 'nonfoil' : selectedPrint.finishes[0]
          );
      }
    }
  }, [selectedEditionId, allCardPrints, lang, selectedLanguage]);

  /* ---------- Actualizar imagen/precio cuando cambia el idioma (si existe la versión) ---------- */
  useEffect(() => {
    if (!selectedLanguage || !selectedEditionId || allCardPrints.length === 0) return;

    const currentPrint = allCardPrints.find(e => e.id === selectedEditionId);
    if (!currentPrint) return;

    const cardInSelectedLanguage = allCardPrints.find(
      card => card.set === currentPrint.set && card.lang === selectedLanguage
    );

    if (cardInSelectedLanguage && cardInSelectedLanguage.image_uris?.large) {
      setSelectedCardImage(cardInSelectedLanguage.image_uris.large);
      const price = cardInSelectedLanguage.prices?.usd || cardInSelectedLanguage.prices?.usd_foil || cardInSelectedLanguage.prices?.usd_etched;
      setMarketPrice(price || null);
    }
  }, [selectedLanguage, selectedEditionId, allCardPrints]);

  /* ---------- Seleccionar por defecto la edición cuando la lista de ediciones únicas cambia ---------- */
  useEffect(() => {
    if (uniqueEditions.length > 0 && !selectedEditionId) {
      setSelectedEditionId(uniqueEditions[0].id);
    }
  }, [uniqueEditions, selectedEditionId]);


  /* ---------- Input handlers ---------- */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (selectedCardName && value !== selectedCardName) {
      setSelectedCardName(null);
      setAllCardPrints([]);
      setSelectedEditionId('');
      setAvailableLanguages([]);
      setSelectedLanguage('');
      setAvailableFinishes([]);
      setSelectedFinish('');
      setMarketPrice(null);
      setSelectedCardImage('/card-back.png');
    }
    setActiveSuggestion(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && activeSuggestion > -1) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeSuggestion]);
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  /* ---------- Al seleccionar una sugerencia: UNICA llamada a API ---------- */
  const handleSuggestionClick = async (suggestion: string) => {
    setSuggestions([]);
    setSearchQuery(suggestion);
    setSelectedCardName(suggestion);
    setIsFetchingEditions(true);

    setSelectedEditionId('');
    setMarketPrice(null);
    setAvailableLanguages([]);
    setSelectedLanguage('');
    setAvailableFinishes([]);
    setSelectedFinish('');
    setAllCardPrints([]);

    try {
      const response = await fetch(`https://api.scryfall.com/cards/search?q=%21"${encodeURIComponent(suggestion)}"&unique=prints&include_multilingual=true`);
      if (!response.ok) throw new Error('Failed to fetch card editions');
      const data = await response.json();

      const prints: ScryfallCard[] = data.data.filter((card: any) => !card.digital);
      setAllCardPrints(prints); 

      // La pre-selección ahora se gestiona en los `useEffect` que dependen de `uniqueEditions`
    } catch (error) {
      console.error(error);
      setAllCardPrints([]);
    } finally {
      setIsFetchingEditions(false);
      setSuggestions([]);
    }
  };

  /* ---------- Click fuera de sugerencias ---------- */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const printsForSelectedSet = useMemo(() => {
      if (!selectedEditionId) return [];
      const selectedSet = uniqueEditions.find(p => p.id === selectedEditionId)?.set;
      if (!selectedSet) return [];
      return allCardPrints.filter(p => p.set === selectedSet);
  }, [selectedEditionId, uniqueEditions, allCardPrints]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold font-headline mb-2">{t.title}</h1>
      <p className="text-muted-foreground mb-8">{t.description}</p>

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <Card>
          <CardHeader>
            <CardTitle>{t.step1Title}</CardTitle>
            <CardDescription>{t.step1Description}</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-2 relative">
                <Label htmlFor="card-search">{t.step1SearchLabel}</Label>
                <Input
                  id="card-search"
                  placeholder={t.step1SearchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  disabled={isFetchingEditions}
                />
                {isFetchingEditions && <Loader2 className="absolute right-3 top-9 h-5 w-5 animate-spin" />}
                {suggestions.length > 0 && (
                  <ul ref={suggestionsRef} className="absolute z-20 w-full bg-card border border-border rounded-md mt-1 shadow-lg">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={suggestion + index}
                        className={cn(
                          "px-3 py-2 cursor-pointer hover:bg-muted",
                          index === activeSuggestion && "bg-muted"
                        )}
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <div className="space-y-2">
                  <Label htmlFor="edition">{t.editionLabel}</Label>
                  <Select
                    disabled={!selectedCardName || isFetchingEditions || uniqueEditions.length === 0}
                    value={uniqueEditions.find(e => e.set === allCardPrints.find(p => p.id === selectedEditionId)?.set)?.id}
                    onValueChange={id => {
                        const newSet = uniqueEditions.find(p => p.id === id)?.set;
                        const firstPrintOfSet = allCardPrints.find(p => p.set === newSet);
                        if (firstPrintOfSet) {
                            setSelectedEditionId(firstPrintOfSet.id);
                        }
                    }}>
                    <SelectTrigger id="edition">
                      <SelectValue placeholder={
                        isFetchingEditions ? "Cargando..." : (uniqueEditions.length === 0 && selectedCardName ? "No se encontraron ediciones" : t.selectEdition)
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueEditions.map((edition) => (
                          <SelectItem key={edition.id} value={edition.id}>
                            {edition.set_name}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">{t.languageLabel}</Label>
                  <Select
                    disabled={availableLanguages.length === 0}
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t.selectLanguage} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.map((langKey) => (
                        <SelectItem key={langKey} value={langKey}>
                          {t.languages[langKey as keyof typeof t.languages] || langKey}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="condition">{t.conditionLabel}</Label>
                  <Select>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder={t.selectCondition} />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(t.conditions) as Array<keyof typeof t.conditions>).map((key) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center">
                            <span className="font-bold w-10 text-left">{key}</span>
                            <span className="mx-2">-</span>
                            <span>{t.conditions[key].split(' - ')[1]}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">{t.quantityLabel}</Label>
                  <Input id="quantity" type="number" defaultValue={1} min={1} />
                </div>
              </div>
            </div>

            <div className="md:col-span-1 flex items-center justify-center">
              <div className="aspect-[3/4] w-full max-w-[250px] relative">
                <Image
                  src={selectedCardImage}
                  alt="Selected card"
                  fill
                  style={{ objectFit: 'contain' }}
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.step2Title}</CardTitle>
            <CardDescription>
              {selectedCardName ?
                t.step2DescriptionSelected.replace('{cardName}', selectedCardName) :
                t.step2Description
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">{t.priceLabel}</Label>
              <Input id="price" type="number" placeholder={t.pricePlaceholder} />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <HelpCircle className="w-3 h-3" />
                {marketPrice ? (
                  <>
                    Precio de mercado de referencia: $ {marketPrice} (USD)
                  </>
                ) : (selectedCardName ? 'Precio no disponible.' : 'Selecciona una carta para ver precio.')}
              </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="print-variant">Variante de Impresión</Label>
                <Select
                    disabled={printsForSelectedSet.length === 0}
                    value={selectedEditionId}
                    onValueChange={setSelectedEditionId}
                >
                    <SelectTrigger id="print-variant">
                        <SelectValue placeholder="Selecciona una variante" />
                    </SelectTrigger>
                    <SelectContent>
                        {printsForSelectedSet.map((print) => {
                            const variantInfo = getVariantInfo(print);
                            return print.finishes.map((finish) => (
                                <SelectItem key={`${print.id}-${finish}`} value={print.id}>
                                    {finish === 'nonfoil' && !variantInfo ? 'Regular' : `${variantInfo} ${finish}`.trim()}
                                </SelectItem>
                            ));
                        })}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>{t.imagesLabel}</Label>
              <div className="flex gap-4">
                <Button variant="outline" className="w-1/2 h-32 flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <span>{t.frontImage}</span>
                </Button>
                <Button variant="outline" className="w-1/2 h-32 flex flex-col items-center justify-center gap-2">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <span>{t.backImage}</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="comments">{t.commentsLabel}</Label>
              <Textarea id="comments" placeholder={t.commentsPlaceholder} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg" className="bg-accent hover:bg-accent/80 text-accent-foreground" disabled={listingLimitReached}>
            {listingLimitReached ? t.listingLimitReached : t.publishListing}
          </Button>
        </div>
      </form>
    </div>
  );
}
